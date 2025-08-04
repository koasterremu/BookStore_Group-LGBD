from flask import request, jsonify
from mongoengine.errors import ValidationError, DoesNotExist
from bson import ObjectId
from src.models.brand_model import Brand
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase

# Helper: kiểm tra ObjectId hợp lệ
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper: CHUYỂN ObjectId về str trong dict/list sâu lồng nhau
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Lấy tất cả các thương hiệu với phân trang, search
def get_all_brands():
    try:
        keyword = request.args.get("keyword", "")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        mongo_query = Brand.objects(isDelete=False)
        if keyword:
            mongo_query = mongo_query.filter(brandName__icontains=keyword)
        total_elements = mongo_query.count()
        brands = mongo_query.skip(skip).limit(limit)
        total_pages = (total_elements + limit - 1) // limit

        # Convert về dict + convert ObjectId về str
        data = [convert_objectid(b.to_mongo().to_dict()) for b in brands]

        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách thương hiệu thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách thương hiệu").to_dict()), 500

# Lấy thương hiệu theo ID
def get_brand_by_id(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        brand = Brand.objects(id=id, isDelete=False).first()
        if not brand:
            return jsonify(ApiResponse(404, None, "Không tìm thấy thương hiệu").to_dict()), 404
        result = convert_objectid(brand.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Lấy thương hiệu thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy thương hiệu theo ID").to_dict()), 500

# Tạo thương hiệu mới
def create_brand():
    try:
        brand_name = request.form.get("brandName")
        description = request.form.get("description")
        image_file = request.files.get("image")    # Flask: upload file qua request.files

        brand = Brand(
            brandName=brand_name,
            description=description,
            isDelete=False
        )

        if image_file:
            # Đọc file buffer & content_type
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            brand.image = image_url

        brand.save()
        result = convert_objectid(brand.to_mongo().to_dict())
        return jsonify(ApiResponse(201, result, "Tạo thương hiệu thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo thương hiệu").to_dict()), 500

# Cập nhật thương hiệu
def update_brand(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        brand = Brand.objects(id=id).first()
        if not brand or brand.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy thương hiệu").to_dict()), 404

        brand_name = request.form.get("brandName")
        description = request.form.get("description")
        image_file = request.files.get("image")

        if brand_name: brand.brandName = brand_name
        if description: brand.description = description

        if image_file:
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            brand.image = image_url

        brand.save()
        result = convert_objectid(brand.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Cập nhật thương hiệu thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật thương hiệu").to_dict()), 500

# Xóa thương hiệu (đánh dấu isDelete là True)
def delete_brand(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        brand = Brand.objects(id=id).first()
        if not brand or brand.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy thương hiệu").to_dict()), 404

        brand.isDelete = True
        brand.save()
        return jsonify(ApiResponse(200, None, "Xóa thương hiệu thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa thương hiệu").to_dict()), 500
