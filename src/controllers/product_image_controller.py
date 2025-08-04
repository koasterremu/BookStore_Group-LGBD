from flask import request, jsonify
from bson import ObjectId
from src.models.product_image_model import ProductImage
from src.models.product_model import Product
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase

# Helper: kiểm tra ObjectId hợp lệ
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper: convert ObjectId về str (đệ quy)
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Helper: serialize 1 product (có thể mở rộng field, ở đây trả tất)
def serialize_product(product):
    if not product: return None
    d = product.to_mongo().to_dict()
    d["_id"] = str(product.id)
    # Nếu muốn add các trường tham chiếu khác lồng nữa thì viết thêm ở đây!
    return convert_objectid(d)

# Helper: serialize 1 ảnh sản phẩm, include full object product
def serialize_product_image(img):
    if not img: return None
    d = img.to_mongo().to_dict()
    d["_id"] = str(img.id)
    d["product"] = serialize_product(img.product)
    return convert_objectid(d)

# Lấy tất cả hình ảnh của một sản phẩm (populate object product)
def get_product_images(product_id):
    try:
        if not is_valid_objectid(product_id):
            return jsonify(ApiResponse(400, None, "ID sản phẩm không hợp lệ").to_dict()), 400
        images = ProductImage.objects(product=ObjectId(product_id))
        image_dtos = [serialize_product_image(img) for img in images]
        return jsonify(ApiResponse(200, image_dtos, "Lấy hình ảnh sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy hình ảnh sản phẩm").to_dict()), 500

# Tạo hình ảnh sản phẩm mới (return object product lồng trong response)
def create_product_image(product_id):
    try:
        if not is_valid_objectid(product_id):
            return jsonify(ApiResponse(400, None, "ID sản phẩm không hợp lệ").to_dict()), 400

        image_file = request.files.get("image")
        if image_file is None:
            return jsonify(ApiResponse(400, None, "Không có file ảnh").to_dict()), 400

        product = Product.objects(id=ObjectId(product_id)).first()
        if not product:
            return jsonify(ApiResponse(404, None, "Không tìm thấy sản phẩm").to_dict()), 404

        buffer = image_file.read()
        image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)

        product_image = ProductImage(
            product=product,
            imageUrl=image_url,
            isDefault=False
        ).save()

        product.images.append(product_image)
        product.save()

        image_dto = serialize_product_image(product_image)
        return jsonify(ApiResponse(201, image_dto, "Tạo hình ảnh sản phẩm thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo hình ảnh sản phẩm").to_dict()), 500

# Cập nhật hình ảnh sản phẩm (populate object product)
def update_product_image(image_id):
    try:
        if not is_valid_objectid(image_id):
            return jsonify(ApiResponse(400, None, "ID hình ảnh không hợp lệ").to_dict()), 400

        image_file = request.files.get("image")
        if image_file is None:
            return jsonify(ApiResponse(400, None, "Không có file ảnh").to_dict()), 400

        product_image = ProductImage.objects(id=ObjectId(image_id)).first()
        if not product_image:
            return jsonify(ApiResponse(404, None, "Hình ảnh không tồn tại").to_dict()), 404

        buffer = image_file.read()
        image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
        product_image.imageUrl = image_url
        product_image.save()

        image_dto = serialize_product_image(product_image)
        return jsonify(ApiResponse(200, image_dto, "Cập nhật hình ảnh sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật hình ảnh sản phẩm").to_dict()), 500

# Xóa hình ảnh sản phẩm và cập nhật Product.images
def delete_product_image(image_id):
    try:
        if not is_valid_objectid(image_id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        product_image = ProductImage.objects(id=ObjectId(image_id)).first()
        if not product_image:
            return jsonify(ApiResponse(404, None, "Hình ảnh không tồn tại").to_dict()), 404

        product_image.delete()
        return jsonify(ApiResponse(200, None, "Xóa hình ảnh sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa hình ảnh sản phẩm").to_dict()), 500

# Đổi trạng thái isDefault cho ảnh
def change_default_image(image_id):
    try:
        if not is_valid_objectid(image_id):
            return jsonify(ApiResponse(400, None, "ID hình ảnh không hợp lệ").to_dict()), 400

        is_default = request.args.get("isDefault", "false").lower() == "true"
        selected_image = ProductImage.objects(id=ObjectId(image_id)).first()
        if not selected_image:
            return jsonify(ApiResponse(404, None, "Hình ảnh không tồn tại").to_dict()), 404

        if is_default:
            # Đặt tất cả hình khác của sản phẩm này về False
            ProductImage.objects(product=selected_image.product, id__ne=selected_image.id).update(set__isDefault=False)
        selected_image.isDefault = is_default
        selected_image.save()
        return jsonify(ApiResponse(200, None, "Cập nhật trạng thái mặc định hình ảnh thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật hình ảnh mặc định").to_dict()), 500
