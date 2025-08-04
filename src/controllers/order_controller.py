from flask import request, jsonify
from bson import ObjectId
from mongoengine.errors import ValidationError
from src.models.order_model import Order
from src.models.order_detail_model import OrderDetail
from src.models.product_model import Product
from src.models.product_image_model import ProductImage
from src.models.product_variation_model import ProductVariation
from src.models.addressBook_model import AddressBook
from src.models.user_model import User
from src.utils.api_response import ApiResponse
import traceback

# Helper: kiểm tra ObjectId hợp lệ
def is_valid_objectid(id_str):
    try:
        if isinstance(id_str, ObjectId):
            return True
        ObjectId(str(id_str))
        return True
    except Exception:
        return False

# Helper: convert ObjectId về str (deep cho dict/list)
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

def deref_document(model_class, value):
    """Convert id (str/ObjectId/model instance) về instance. Nếu không tồn tại thì trả None."""
    if not value:
        return None
    if isinstance(value, model_class):
        return value
    if isinstance(value, ObjectId) or (isinstance(value, str) and is_valid_objectid(value)):
        doc = model_class.objects(id=ObjectId(str(value))).first()
        return doc
    return None

# Deep serialize Product (có images, variations là object đầy đủ)
def serialize_product(product):
    p = deref_document(Product, product)
    if not p:
        return None
    d = p.to_mongo().to_dict()
    d["_id"] = str(p.id)

    # Populate images
    images = []
    if hasattr(p, "images") and p.images:
        for img in p.images:
            img_obj = deref_document(ProductImage, img)
            if img_obj:
                img_dict = img_obj.to_mongo().to_dict()
                img_dict["_id"] = str(img_obj.id)
                img_dict["product"] = str(img_obj.product.id) if img_obj.product else None
                images.append(convert_objectid(img_dict))
    d["images"] = images

    # Populate variations
    variations = []
    if hasattr(p, "variations") and p.variations:
        for v in p.variations:
            v_obj = deref_document(ProductVariation, v)
            if v_obj:
                v_dict = v_obj.to_mongo().to_dict()
                v_dict["_id"] = str(v_obj.id)
                v_dict["product"] = str(v_obj.product.id) if v_obj.product else None
                variations.append(convert_objectid(v_dict))
    d["variations"] = variations

    return convert_objectid(d)

def serialize_document(doc):
    """Serialize bất kỳ Document mongoengine nào (User, AddressBook...)"""
    # doc có thể là instance, ObjectId, str
    if not doc:
        return None
    # Nếu truyền vào là ObjectId hoặc str id, deref:
    if not hasattr(doc, "to_mongo"):  # không phải instance
        # Phỏng đoán model_class
        # Nếu muốn an toàn hơn nên truyền kèm model class
        # Ở serialize_order đã làm đúng rồi!
        return str(doc)
    d = doc.to_mongo().to_dict()
    d["_id"] = str(doc.id)
    return convert_objectid(d)

# Helper: serialize an Order (deep populate mọi field reference, product có images/variations đầy đủ)
def serialize_order(order):
    # user
    u = None
    if getattr(order, "user", None):
        uobj = deref_document(User, order.user)
        u = serialize_document(uobj) if uobj else str(order.user)

    # addressBook
    addr = None
    if getattr(order, "addressBook", None):
        aobj = deref_document(AddressBook, order.addressBook)
        addr = serialize_document(aobj) if aobj else str(order.addressBook)

    # orderDetails (populate product, productVariation)
    details = []
    for d in order.orderDetails:
        if not d:
            continue
        d_obj = deref_document(OrderDetail, d)
        if not d_obj:
            details.append(str(d))
            continue
        detail_dict = serialize_document(d_obj)

        # product
        prod = None
        if getattr(d_obj, "product", None):
            pobj = deref_document(Product, d_obj.product)
            prod = serialize_product(pobj) if pobj else str(d_obj.product)
        detail_dict["product"] = prod

        # productVariation
        variation = None
        if getattr(d_obj, "productVariation", None):
            var_obj = deref_document(ProductVariation, d_obj.productVariation)
            variation = serialize_document(var_obj) if var_obj else str(d_obj.productVariation)
        detail_dict["productVariation"] = variation

        details.append(detail_dict)

    # Serialize chính bản thân order
    data = serialize_document(order)
    data["user"] = u
    data["addressBook"] = addr
    data["orderDetails"] = details
    return data

# Tạo đơn hàng mới
def create_order():
    try:
        data = request.get_json()
        code          = data.get("code")
        date          = data.get("date")
        note          = data.get("note")
        paymentMethod = data.get("paymentMethod")
        totalPrice    = data.get("totalPrice")
        discount      = float(data.get("discount")) if data.get("discount") is not None else 0
        user_in       = data.get("user")
        addressBook_in= data.get("addressBook")
        status        = data.get("status")
        orderDetails  = data.get("orderDetails", [])

        if not is_valid_objectid(user_in["userId"]) or not is_valid_objectid(addressBook_in["addressBookId"]):
            return jsonify(ApiResponse(400, None, "ID người dùng hoặc địa chỉ không hợp lệ").to_dict()), 400

        order = Order(
            code=code,
            date=date,
            note=note,
            paymentMethod=paymentMethod,
            totalPrice=totalPrice,
            discount=discount,
            user=ObjectId(user_in["userId"]),
            addressBook=ObjectId(addressBook_in["addressBookId"]),
            status=status,
        ).save()

        for detail in orderDetails:
            product_in = detail["product"]
            product_id = product_in.get("productId")
            product = Product.objects(id=product_id).first()
            if not product:
                raise Exception(f"Không tìm thấy sản phẩm với ID: {product_id}")
            if product.stock < detail.get("quantity", 0):
                raise Exception(f"Sản phẩm {getattr(product, 'productName', '')} không đủ tồn kho.")

            product.stock = product.stock - detail["quantity"]
            product.save()

            order_detail = OrderDetail(
                order=order,
                product=product,
                productVariation=ObjectId(detail["productVariation"]["variationId"]) if detail.get("productVariation") else None,
                quantity=detail.get("quantity"),
                price=detail.get("price")
            ).save()
            order.orderDetails.append(order_detail)

        order.save()
        result = serialize_order(order)
        return jsonify(ApiResponse(201, result, "Tạo đơn hàng thành công").to_dict()), 201
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo đơn hàng").to_dict()), 500

# Lấy tất cả order với filter/pagination
def get_all_orders():
    try:
        page   = int(request.args.get("page", 1))
        limit  = int(request.args.get("limit", 10))
        code   = request.args.get("code")
        status = request.args.get("status")
        method = request.args.get("method")
        skip   = (page - 1) * limit

        query = {}
        if code:   query["code"] = code
        if status: query["status"] = status
        if method: query["paymentMethod"] = method

        orders_qs = Order.objects(**query).order_by("-date")
        total_elements = orders_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        orders = orders_qs.skip(skip).limit(limit)

        data = [serialize_order(o) for o in orders]
        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách đơn hàng thành công").to_dict()), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách đơn hàng").to_dict()), 500

# Lấy đơn hàng theo user_id với phân trang (populate)
def get_orders_by_user_id(user_id):
    try:
        page   = int(request.args.get("page", 1))
        limit  = int(request.args.get("limit", 10))
        skip   = (page - 1) * limit

        orders_qs = Order.objects(user=ObjectId(user_id)).order_by("-date")
        total_elements = orders_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        orders = orders_qs.skip(skip).limit(limit)

        data = [serialize_order(o) for o in orders]
        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách đơn hàng theo người dùng thành công").to_dict()), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách đơn hàng theo người dùng").to_dict()), 500

# Đổi trạng thái đơn hàng
def change_order_status(order_id):
    try:
        status = request.args.get("status")
        if not status:
            return jsonify(ApiResponse(400, None, "Thiếu trạng thái đơn hàng").to_dict()), 400

        order = Order.objects(id=order_id).first()
        if not order:
            return jsonify(ApiResponse(404, None, "Đơn hàng không tồn tại").to_dict()), 404

        order.status = status
        order.save()

        return jsonify(ApiResponse(200, None, "Thay đổi trạng thái đơn hàng thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi thay đổi trạng thái đơn hàng").to_dict()), 500
