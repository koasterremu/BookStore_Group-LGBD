from flask import Blueprint
from src.controllers.product_controller import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
    get_filtered_products,
    recommend_products,
)

product_bp = Blueprint("product", __name__)

# Lấy danh sách sản phẩm (GET) và tạo mới sản phẩm (POST với nhiều ảnh)
@product_bp.route("/api/products", methods=["GET"])
def list_products():
    return get_all_products()

@product_bp.route("/api/products", methods=["POST"])
def create_product_route():
    # Gửi form-data với images: ["file1", "file2", ...]
    return create_product()

# Lọc sản phẩm theo trạng thái đặt biệt
@product_bp.route("/api/products/filtered", methods=["GET"])
def get_filtered_products_route():
    return get_filtered_products()

# Gợi ý sản phẩm cho người dùng hoặc random
@product_bp.route("/api/products/recommend", methods=["GET"])
def recommend_products_route():
    return recommend_products()

# Lấy chi tiết, cập nhật, xóa sản phẩm theo id
@product_bp.route("/api/products/<id>", methods=["GET"])
def get_product(id):
    return get_product_by_id(id)

@product_bp.route("/api/products/<id>", methods=["PUT"])
def update_product_route(id):
    # Form-data với images[] khi cập nhật file ảnh
    return update_product(id)

@product_bp.route("/api/products/<id>", methods=["DELETE"])
def delete_product_route(id):
    return delete_product(id)
