from flask import request, jsonify
from bson import ObjectId
from src.models.new_model import New
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase

# Helper kiểm tra ObjectId hợp lệ
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper chuyển ObjectId trong dict/list về str (đệ quy)
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Lấy tất cả các bản tin (phân trang, search, lọc chưa xóa)
def get_all_news():
    try:
        keyword = request.args.get("keyword", "")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        mongo_query = New.objects(isDeleted=False)
        if keyword:
            mongo_query = mongo_query.filter(title__icontains=keyword)

        total_elements = mongo_query.count()
        news = mongo_query.skip(skip).limit(limit)
        total_pages = (total_elements + limit - 1) // limit

        data = [convert_objectid(n.to_mongo().to_dict()) for n in news]

        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách bản tin thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách bản tin").to_dict()), 500

# Lấy bản tin theo ID
def get_new_by_id(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        news_item = New.objects(id=id, isDeleted=False).first()
        if not news_item:
            return jsonify(ApiResponse(404, None, "Không tìm thấy bản tin").to_dict()), 404
        result = convert_objectid(news_item.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Lấy bản tin thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy bản tin theo ID").to_dict()), 500

# Tạo bản tin mới
def create_new():
    try:
        title = request.form.get("title")
        content = request.form.get("content")
        image_file = request.files.get("image")

        news_item = New(
            title=title,
            content=content,
            isDeleted=False
        )

        if image_file:
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            news_item.image = image_url

        news_item.save()
        result = convert_objectid(news_item.to_mongo().to_dict())
        return jsonify(ApiResponse(201, result, "Tạo bản tin thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo bản tin").to_dict()), 500

# Cập nhật bản tin
def update_new(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        news_item = New.objects(id=id).first()
        if not news_item or news_item.isDeleted:
            return jsonify(ApiResponse(404, None, "Không tìm thấy bản tin").to_dict()), 404

        title = request.form.get("title")
        content = request.form.get("content")
        image_file = request.files.get("image")

        if title: news_item.title = title
        if content: news_item.content = content
        if image_file:
            buffer = image_file.read()
            image_url = upload_file_to_firebase(buffer, image_file.filename, image_file.content_type)
            news_item.image = image_url

        news_item.save()
        result = convert_objectid(news_item.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Cập nhật bản tin thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật bản tin").to_dict()), 500

# Xóa bản tin (isDeleted: true)
def delete_new(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        news_item = New.objects(id=id).first()
        if not news_item or news_item.isDeleted:
            return jsonify(ApiResponse(404, None, "Không tìm thấy bản tin").to_dict()), 404
        news_item.isDeleted = True
        news_item.save()
        return jsonify(ApiResponse(200, None, "Xóa bản tin thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa bản tin").to_dict()), 500
