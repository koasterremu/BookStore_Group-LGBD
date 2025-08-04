from flask import Blueprint
from src.controllers.user_controller import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
    change_password,
)

user_bp = Blueprint("user", __name__)

# Lấy danh sách người dùng (GET), tạo mới người dùng (POST)
@user_bp.route("/api/users", methods=["GET"])
def list_users():
    return get_all_users()

@user_bp.route("/api/users", methods=["POST"])
def create_user_route():
    # Gửi form-data với file "avatar"
    return create_user()

# Lấy, cập nhật, xóa người dùng
@user_bp.route("/api/users/<id>", methods=["GET"])
def get_user(id):
    return get_user_by_id(id)

@user_bp.route("/api/users/<id>", methods=["PUT"])
def update_user_route(id):
    # Gửi form-data với file "avatar"
    return update_user(id)

@user_bp.route("/api/users/<id>", methods=["DELETE"])
def delete_user_route(id):
    return delete_user(id)

# Đổi mật khẩu
@user_bp.route("/api/users/<id>/change-password", methods=["PUT"])
def change_password_route(id):
    return change_password(id)
