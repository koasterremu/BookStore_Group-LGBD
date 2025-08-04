from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import re
import jwt
import os
from datetime import datetime, timedelta

from bson import ObjectId
from src.models.user_model import User
from src.utils.api_response import ApiResponse
from src.controllers.email_controller import send_reset_password_email

ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

# Helper: Convert ObjectId về str (recursive)
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Đăng ký
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    phone_number = data.get('phoneNumber')
    role = data.get('role')
    address = data.get('address')
    full_name = data.get('fullName')

    # Kiểm tra trường bắt buộc
    if not all([username, password, email, phone_number, role, full_name]):
        return jsonify(ApiResponse(400, None, "Thiếu các trường bắt buộc").to_dict()), 400

    # Regex kiểm tra email
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(email_regex, email):
        return jsonify(ApiResponse(400, None, "Định dạng email không hợp lệ").to_dict()), 400

    # Check email và phone đã tồn tại
    if User.objects(email=email).first():
        return jsonify(ApiResponse(409, None, "Người dùng với email đã tồn tại").to_dict()), 409
    if User.objects(phoneNumber=phone_number).first():
        return jsonify(ApiResponse(409, None, "Người dùng với số điện thoại đã tồn tại").to_dict()), 409

    # Băm mật khẩu
    hashed_password = generate_password_hash(password)
    is_active = False if role == "STAFF" else True

    # Tạo user mới
    try:
        created_user = User(
            username=username,
            password=hashed_password,
            email=email,
            phoneNumber=phone_number,
            role=role,
            address=address,
            fullName=full_name,
            active=is_active
        ).save()
    except Exception as e:
        return jsonify(ApiResponse(500, None, f"Lỗi tạo người dùng: {str(e)}").to_dict()), 500

    # Lấy user vừa tạo, bỏ trường nhạy cảm, convert ObjectId
    user_response = User.objects(id=created_user.id).exclude('password').first()
    user_dict = convert_objectid(user_response.to_mongo().to_dict())
    user_dict['id'] = str(user_response.id)
    user_dict.pop('_id', None)
    user_dict.pop('password', None)
    user_dict.pop('resetPasswordToken', None)

    msg = "Đăng ký người dùng thành công. Vui lòng chờ quản trị viên phê duyệt nếu bạn là nhân viên."
    return jsonify(ApiResponse(201, {"user": user_dict}, msg).to_dict()), 201

# Đăng nhập
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify(ApiResponse(400, None, "Thiếu các trường bắt buộc").to_dict()), 400

    user = User.objects(username=username).first()
    if not user:
        return jsonify(ApiResponse(404, None, "Không tồn tại người dùng với username này, vui lòng đăng ký trước!").to_dict()), 404

    if not user.active:
        return jsonify(ApiResponse(403, None, "Tài khoản chưa được kích hoạt. Vui lòng chờ quản trị viên phê duyệt.").to_dict()), 403

    if not check_password_hash(user.password, password):
        return jsonify(ApiResponse(401, None, "Thông tin đăng nhập không chính xác").to_dict()), 401

    # Ví dụ SỬ DỤNG JWT động:
    # payload = {"id": str(user.id), "role": str(user.role) if user.role else ""}
    # jwt_token = jwt.encode(payload, "bookstorysecret", algorithm="HS256")
    # if isinstance(jwt_token, bytes):
    #     jwt_token = jwt_token.decode('utf-8')

    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODI1YmMwOTQ1MDc5ZGQ5YjQyZGEyZSIsInJvbGUiOiJDVVNUT01FUiJ9.Rj32sgP63bEsw8TMenmG7xBQtEQ1HKHFIxpDCRy_D4A"

    user_response = {
        "userId": str(user.id) if user.id else "",
        "username": user.username or "",
        "email": user.email or "",
        "phoneNumber": user.phoneNumber or "",
        "fullName": getattr(user, "fullName", "") or "",
        "avatar": getattr(user, "avatar", "") or "",
        "resetPasswordToken": getattr(user, "resetPasswordToken", "") or "",
        "role": str(user.role) if user.role else "",
        "address": user.address or "",
        "isDelete": getattr(user, "isDelete", False),
        "enabled": not getattr(user, "isDelete", False),
        "authorities": [],
        "accountNonLocked": True,
        "accountNonExpired": True,
        "credentialsNonExpired": True,
    }

    # Nếu user_response có trường nào là ObjectId (ví dụ userId), đảm bảo convert luôn:
    user_response = convert_objectid(user_response)

    return jsonify({
        "statusCode": 200,
        "payload": [{"jwtToken": jwt_token}, user_response],
        "message": "Đăng nhập thành công",
        "success": True
    }), 200

# Quên mật khẩu
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.objects(email=email).first()
    if not user:
        return jsonify(ApiResponse(404, None, "Không tìm thấy người dùng với email này").to_dict()), 404
    reset_token = jwt.encode(
        {"userId": str(user.id), "exp": datetime.utcnow() + timedelta(hours=1)},
        "bookstorysecret",
        algorithm="HS256"
    )
    if isinstance(reset_token, bytes):
        reset_token = reset_token.decode('utf-8')
    user.resetPasswordToken = reset_token
    user.save()
    send_reset_password_email(user.email, reset_token)
    return jsonify(ApiResponse(200, None, "Token đặt lại mật khẩu đã được gửi tới email của bạn").to_dict()), 200

# Đặt lại mật khẩu
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')
    try:
        decoded = jwt.decode(token, "bookstorysecret", algorithms=["HS256"])
        user_id = decoded.get("userId")
        user = User.objects(id=user_id).first()
        if not user or user.resetPasswordToken != token:
            return jsonify(ApiResponse(400, None, "Token không hợp lệ hoặc đã hết hạn").to_dict()), 400

        hashed_password = generate_password_hash(new_password)
        user.password = hashed_password
        user.resetPasswordToken = None
        user.save()
        return jsonify(ApiResponse(200, None, "Mật khẩu của bạn đã được cập nhật thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, str(e), "Đặt lại mật khẩu thất bại").to_dict()), 500
