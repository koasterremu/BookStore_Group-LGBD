from flask import request, jsonify
from mongoengine.errors import ValidationError, DoesNotExist
from bson import ObjectId
from src.models.category_model import Category
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase

# Helper kiểm tra ObjectId hợp lệ
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper CHUYỂN ObjectId sang str trong mọi dict/list
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Lấy tất cả category (phân trang, search)
def get_all_categories():
    try:
        keyword = request.args.get("keyword", "")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        mongo_query = Category.objects(isDelete=False)
        if keyword:
            mongo_query = mongo_query.filter(categoryName__icontains=keyword)
        total_elements = mongo_query.count()
        categories = mongo_query.skip(skip).limit(limit)
        total_pages = (total_elements + limit - 1) // limit

        data = [convert_objectid(c.to_mongo().to_dict()) for c in categories]

        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh mục thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh mục").to_dict()), 500

# Lấy category theo ID
def get_category_by_id(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        category = Category.objects(id=id, isDelete=False).first()
        if not category:
            return jsonify(ApiResponse(404, None, "Không tìm thấy danh mục").to_dict()), 404
        result = convert_objectid(category.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Lấy danh mục thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh mục theo ID").to_dict()), 500

# Tạo mới category
def create_category():
    try:
        category_name = request.form.get("categoryName")
        description = request.form.get("description")
        image_file = request.files.get("image")

        category = Category(
            categoryName=category_name,
            description=description,
            isDelete=False
        )

        if image_file:
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            category.image = image_url

        category.save()
        result = convert_objectid(category.to_mongo().to_dict())
        return jsonify(ApiResponse(201, result, "Tạo danh mục thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo danh mục").to_dict()), 500

# Cập nhật category
def update_category(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        category = Category.objects(id=id).first()
        if not category or category.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy danh mục").to_dict()), 404

        category_name = request.form.get("categoryName")
        description   = request.form.get("description")
        image_file    = request.files.get("image")

        if category_name: category.categoryName = category_name
        if description: category.description = description

        if image_file:
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            category.image = image_url

        category.save()
        result = convert_objectid(category.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Cập nhật danh mục thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật danh mục").to_dict()), 500

# Xóa category (isDelete: true)
def delete_category(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        category = Category.objects(id=id).first()
        if not category or category.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy danh mục").to_dict()), 404

        category.isDelete = True
        category.save()
        return jsonify(ApiResponse(200, None, "Xóa danh mục thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa danh mục").to_dict()), 500
