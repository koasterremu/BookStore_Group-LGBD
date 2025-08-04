from flask import request, jsonify
from mongoengine.errors import DoesNotExist
from bson import ObjectId
from src.models.order_model import Order
from src.models.product_model import Product
from src.models.product_image_model import ProductImage
from src.models.order_detail_model import OrderDetail
from src.utils.api_response import ApiResponse
from src.services.mail_service import send_mail
import os

# Helper: convert ObjectId về str đệ quy
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

def is_valid_objectid(id_str):
    try:
        ObjectId(str(id_str))
        return True
    except Exception:
        return False

# Helper: tìm Order theo mã code
def find_order_by_code(order_code):
    # KHÔNG dùng select_related
    order = Order.objects(code=order_code).first()
    if not order:
        raise ValueError(f"Order not found with code: {order_code}")
    return order

# Safe get attribute from object or dict
def safe_get(obj, field, default=None):
    if not obj:
        return default
    if isinstance(obj, dict):
        return obj.get(field, default)
    return getattr(obj, field, default)

# Gửi email xác nhận đơn hàng (đã sửa version không lỗi)
def send_order_confirmation_email():
    order_code = request.args.get("orderCode")
    try:
        order = find_order_by_code(order_code)
        # order.addressBook là ReferenceField
        addressBook = order.addressBook

        recipient_name = safe_get(addressBook, "recipientName", "")
        address        = safe_get(addressBook, "address", "")
        ward           = safe_get(addressBook, "ward", "")
        district       = safe_get(addressBook, "district", "")
        city           = safe_get(addressBook, "city", "")
        phone          = safe_get(addressBook, "phoneNumber", "")
        email_to       = safe_get(addressBook, "email", "")

        discount_percentage = float(order.discount or 0) / 100
        total_price = float(order.totalPrice)
        subtotal = total_price / (1 - discount_percentage) if discount_percentage else total_price
        discount_amount = subtotal * discount_percentage

        items_html = ""
        # order.orderDetails là ListField(ReferenceField(OrderDetail))
        # => Chuẩn hóa: phải fetch từng order detail (ObjectId) nếu là id, tránh trường hợp list id
        order_details = []
        for od in order.orderDetails:
            if isinstance(od, OrderDetail):  # đã dereference
                order_details.append(od)
            elif is_valid_objectid(od):
                detail_obj = OrderDetail.objects(id=od).first()
                if detail_obj:
                    order_details.append(detail_obj)
            # nếu không thì skip entry lỗi

        for item in order_details:
            product = item.product
            if not isinstance(product, Product):
                pid = safe_get(product, "_id") or safe_get(product, "id") or product
                if pid and is_valid_objectid(pid):
                    product = Product.objects(id=pid).first()
                else:
                    product = None
            if not product:
                continue

            # KHÔNG còn xử lý images ở đây nữa --- bỏ qua default_image_url, images

            # Thông tin biến thể
            variation_info = ""
            variation = safe_get(item, "productVariation", None)
            if variation:
                # Nếu là ObjectId, dereference
                from src.models.product_variation_model import ProductVariation
                if not isinstance(variation, dict) and not isinstance(variation, str):
                    # kiểu ProductVariation model
                    attr_name = getattr(variation, "attributeName", "")
                    attr_val  = getattr(variation, "attributeValue", "")
                elif isinstance(variation, dict):
                    attr_name = variation.get("attributeName", "")
                    attr_val  = variation.get("attributeValue", "")
                elif is_valid_objectid(variation):
                    from src.models.product_variation_model import ProductVariation
                    variation_obj = ProductVariation.objects(id=variation).first()
                    if variation_obj:
                        attr_name = getattr(variation_obj, "attributeName", "")
                        attr_val  = getattr(variation_obj, "attributeValue", "")
                    else:
                        attr_name = attr_val = ""
                else:
                    attr_name = attr_val = ""
                variation_info = f"<p>{attr_name}: {attr_val}</p>" if attr_name else ""

            items_html += f"""
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e2e2;">
                    <div style="flex: 1;">
                        <p style="font-weight: bold;">{safe_get(product,'productName','')}</p>
                        {variation_info}
                        <p>Số lượng: {safe_get(item,'quantity') or ''}</p>
                    </div>
                    <div style="text-align: right; margin-left: 10px"><p>{getattr(item,'price',0):,.0f}₫</p></div>
                </div>
            """

        html_content = f"""
        <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2;">
            <h2 style="color: #ff9900; font-weight: bold;">Xác nhận đơn hàng</h2>
            <p>Xin chào {recipient_name},</p>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
            <h3 style="font-weight: bold; border-bottom: 2px solid #e2e2e2; padding-bottom: 10px;">Sản phẩm đã đặt</h3>
            {items_html}
            <div style="border-top: 2px solid #e2e2e2; padding: 20px 0;">
                <p><strong>Tạm tính:</strong> {subtotal:,.0f}₫</p>
                <p><strong>Giảm giá:</strong> -{discount_amount:,.0f}₫</p>
                <p><strong>Tổng cộng:</strong> <span style="color: #ff9900;">{total_price:,.0f}₫</span></p>
            </div>
            <h3 style="font-weight: bold; margin-top: 20px;">Thông tin giao hàng</h3>
            <p>{recipient_name}</p>
            <p>{address}, {ward}, {district}, {city}</p>
            <p>{phone}</p>
            <h3 style="font-weight: bold; margin-top: 20px;">Thanh toán</h3>
            <p>{order.paymentMethod} - {order.status}</p>
            <p style="margin-top: 30px; font-size: 12px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với <a href="#" style="color: #ff9900;">Dịch vụ khách hàng</a>.</p>
        </div>
        """

        subject = f"Xác nhận đơn hàng - {order.code}"
        send_mail(email_to, subject, html_content)

        return jsonify({"message": "Email xác nhận đơn hàng đã được gửi thành công!"}), 200
    except Exception as error:
        print(error)
        return jsonify({"message": "Lỗi khi gửi email xác nhận đơn hàng"}), 500

# Hàm gửi email reset password (không thay đổi)
def send_reset_password_email(email, reset_token):
    try:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_url = f"{frontend_url}/reset-password?token={reset_token}"

        html_content = f"""
        <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2;">
            <h2 style="color: #ff9900; font-weight: bold;">Yêu cầu đặt lại mật khẩu</h2>
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
            <a href="{reset_url}" style="display: inline-block; background-color: #ff9900; color: white; padding: 10px 20px; text-decoration: none; margin-top: 10px; border-radius: 4px;">Đặt lại mật khẩu</a>
            <p style="margin-top: 20px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p style="margin-top: 30px; font-size: 12px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với <a href="#" style="color: #ff9900;">Dịch vụ khách hàng</a>.</p>
        </div>
        """
        subject = "Đặt lại mật khẩu của bạn"
        send_mail(email, subject, html_content)
        print("Email đặt lại mật khẩu đã được gửi thành công!")
    except Exception as error:
        print("Lỗi khi gửi email đặt lại mật khẩu:", error)
        raise Exception("Lỗi khi gửi email đặt lại mật khẩu")
