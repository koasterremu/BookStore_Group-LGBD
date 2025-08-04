from flask import Blueprint, request
from src.controllers.brand_controller import (
    get_all_brands,
    create_brand,
    get_brand_by_id,
    update_brand,
    delete_brand,
)
from src.middlewares.auth_middleware import check_auth

brand_bp = Blueprint("brand", __name__)

# Lấy danh sách thương hiệu và tạo mới (POST cần check_auth)
@brand_bp.route("/api/brands", methods=["GET"])
def list_brands():
    return get_all_brands()

@brand_bp.route("/api/brands", methods=["POST"])
def create_brand_route():
    # Flask không cần middleware riêng kiểu Multer, chỉ gửi form-data với key "image"
    return create_brand()

# Lấy thương hiệu theo ID, cập nhật, xóa (có kiểm tra quyền cho PUT/DELETE)
@brand_bp.route("/api/brands/<id>", methods=["GET"])
def get_brand(id):
    return get_brand_by_id(id)

@brand_bp.route("/api/brands/<id>", methods=["PUT"])
def update_brand_route(id):
    return update_brand(id)

@brand_bp.route("/api/brands/<id>", methods=["DELETE"])
def delete_brand_route(id):
    return delete_brand(id)
