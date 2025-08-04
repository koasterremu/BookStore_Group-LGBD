from flask import Blueprint
from src.controllers.auth_controller import (
    register,
    login,
    forgot_password,
    reset_password,
)

auth_bp = Blueprint("auth", __name__)

# Route đăng ký người dùng mới
@auth_bp.route('/register', methods=['POST'])
def register_route():
    return register()

# Route đăng nhập người dùng
@auth_bp.route('/login', methods=['POST'])
def login_route():
    return login()

# Route yêu cầu đặt lại mật khẩu
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password_route():
    return forgot_password()

# Route đặt lại mật khẩu
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    return reset_password()
