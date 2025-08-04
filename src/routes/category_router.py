from flask import Blueprint
from src.controllers.category_controller import (
    get_all_categories,
    create_category,
    get_category_by_id,
    update_category,
    delete_category,
)
from src.middlewares.auth_middleware import check_auth

category_bp = Blueprint("category", __name__)

# Lấy tất cả danh mục và tạo danh mục mới (POST cần check_auth)
@category_bp.route("/api/categories", methods=["GET"])
def list_categories():
    return get_all_categories()

@category_bp.route("/api/categories", methods=["POST"])
def create_category_route():
    # Gửi form-data với file "image"
    return create_category()

# Lấy, cập nhật, xóa danh mục theo ID (PUT/DELETE cần check_auth)
@category_bp.route("/api/categories/<id>", methods=["GET"])
def get_category(id):
    return get_category_by_id(id)

@category_bp.route("/api/categories/<id>", methods=["PUT"])
def update_category_route(id):
    return update_category(id)

@category_bp.route("/api/categories/<id>", methods=["DELETE"])
def delete_category_route(id):
    return delete_category(id)
