from flask import request, jsonify
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user_model import User
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase

def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper: đệ quy convert ObjectId về str
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Lấy tất cả user với phân trang & tìm kiếm
def get_all_users():
    try:
        search_text = request.args.get("searchText")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        query = {}
        if search_text:
            query["username__icontains"] = search_text

        users_qs = User.objects(**query)
        total_elements = users_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        users = users_qs.skip(skip).limit(limit)

        data = [convert_objectid(u.to_mongo().to_dict()) for u in users]
        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages,
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách người dùng thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách người dùng").to_dict()), 500

# Lấy user theo ID
def get_user_by_id(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        user = User.objects(id=id).first()
        if not user:
            return jsonify(ApiResponse(404, None, "Không tìm thấy người dùng").to_dict()), 404
        user_data = convert_objectid(user.to_mongo().to_dict())
        return jsonify(ApiResponse(200, user_data, "Lấy người dùng thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy người dùng theo ID").to_dict()), 500

# Tạo mới user
def create_user():
    try:
        username    = request.form.get("username")
        password    = request.form.get("password")
        email       = request.form.get("email")
        phoneNumber = request.form.get("phoneNumber")
        fullName    = request.form.get("fullName")
        role        = request.form.get("role")
        address     = request.form.get("address")
        image_file  = request.files.get("avatar") or request.files.get("image")

        hashed_password = generate_password_hash(password)
        user = User(
            username=username,
            password=hashed_password,
            email=email,
            phoneNumber=phoneNumber,
            fullName=fullName,
            role=role,
            address=address,
            isDelete=False,
        )
        if image_file:
            buf = image_file.read()
            image_url = upload_file_to_firebase(buf, image_file.filename, image_file.content_type)
            user.avatar = image_url

        user.save()
        user_data = convert_objectid(user.to_mongo().to_dict())
        return jsonify(ApiResponse(201, user_data, "Tạo người dùng thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo người dùng").to_dict()), 500

# Cập nhật user
def update_user(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        user = User.objects(id=id).first()
        if not user:
            return jsonify(ApiResponse(404, None, "Không tìm thấy người dùng").to_dict()), 404

        username    = request.form.get("username")
        email       = request.form.get("email")
        phoneNumber = request.form.get("phoneNumber")
        fullName    = request.form.get("fullName")
        role        = request.form.get("role")
        address     = request.form.get("address")
        image_file  = request.files.get("avatar") or request.files.get("image")

        # Update if available
        if username:    user.username    = username
        if email:       user.email       = email
        if phoneNumber: user.phoneNumber = phoneNumber
        if fullName:    user.fullName    = fullName
        if role:        user.role        = role
        if address:     user.address     = address

        if image_file:
            buf = image_file.read()
            image_url = upload_file_to_firebase(buf, image_file.filename, image_file.content_type)
            user.avatar = image_url

        user.save()
        user_data = convert_objectid(user.to_mongo().to_dict())
        return jsonify(ApiResponse(200, user_data, "Cập nhật người dùng thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật người dùng").to_dict()), 500

# Xóa user (isDelete = True)
def delete_user(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        user = User.objects(id=id).first()
        if not user:
            return jsonify(ApiResponse(404, None, "Không tìm thấy người dùng").to_dict()), 404
        user.isDelete = True
        user.save()
        return jsonify(ApiResponse(200, None, "Xóa người dùng thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa người dùng").to_dict()), 500

# Đổi mật khẩu người dùng
def change_password(id):
    try:
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password     = data.get("newPassword")

        if not current_password or not new_password:
            return jsonify(ApiResponse(400, None, "Vui lòng nhập đầy đủ thông tin mật khẩu").to_dict()), 400

        user = User.objects(id=id).first()
        if not user:
            return jsonify(ApiResponse(404, None, "Không tìm thấy người dùng").to_dict()), 404

        # Kiểm tra mật khẩu hiện tại
        if not check_password_hash(user.password, current_password):
            return jsonify(ApiResponse(400, None, "Mật khẩu hiện tại không chính xác").to_dict()), 400

        # Băm và lưu mật khẩu mới
        user.password = generate_password_hash(new_password)
        user.save()
        return jsonify(ApiResponse(200, None, "Đổi mật khẩu thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi đổi mật khẩu").to_dict()), 500
