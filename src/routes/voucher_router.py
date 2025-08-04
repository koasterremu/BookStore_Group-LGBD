from flask import Blueprint
from src.controllers.voucher_controller import (
    get_all_vouchers,
    create_voucher,
    update_voucher,
    delete_voucher,
    mark_voucher_as_used,
    check_voucher_code,
    change_voucher_status,
)
from src.middlewares.auth_middleware import check_auth

voucher_bp = Blueprint("voucher", __name__)

# Lấy danh sách voucher và tạo voucher mới
@voucher_bp.route("/api/vouchers", methods=["GET"])
def get_vouchers_route():
    return get_all_vouchers()

@voucher_bp.route("/api/vouchers", methods=["POST"])
def create_voucher_route():
    return create_voucher()

# Lấy, cập nhật, xóa voucher theo id
@voucher_bp.route("/api/vouchers/<id>", methods=["PUT"])
def update_voucher_route(id):
    return update_voucher(id)

@voucher_bp.route("/api/vouchers/<id>", methods=["DELETE"])
def delete_voucher_route(id):
    return delete_voucher(id)

# Đánh dấu voucher là đã sử dụng
@voucher_bp.route("/api/vouchers/<id>/mark-as-used", methods=["PUT"])
def mark_voucher_as_used_route(id):
    return mark_voucher_as_used(id)

# Kiểm tra mã voucher (GET /check/<code>)
@voucher_bp.route("/api/vouchers/check/<code>", methods=["GET"])
def check_voucher_code_route(code):
    return check_voucher_code(code)

# Thay đổi trạng thái sử dụng của voucher (toggle)
@voucher_bp.route("/api/vouchers/<id>/change-status", methods=["PUT"])
def change_voucher_status_route(id):
    return change_voucher_status(id)
