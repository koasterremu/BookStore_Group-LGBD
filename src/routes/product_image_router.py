from flask import Blueprint, request
from src.controllers.product_image_controller import (
    get_product_images,
    create_product_image,
    update_product_image,
    delete_product_image,
    change_default_image,
)

product_image_bp = Blueprint("product_image", __name__)

# Route: Lấy tất cả hình ảnh của một sản phẩm
@product_image_bp.route("/api/product_image/<product_id>", methods=["GET"])
def get_images(product_id):
    return get_product_images(product_id)

# Route: Tạo hình ảnh sản phẩm mới (POST với file "image")
@product_image_bp.route("/api/product_image/<product_id>", methods=["POST"])
def create_image(product_id):
    return create_product_image(product_id)

# Route: Cập nhật hình ảnh sản phẩm (PUT với file "image")
@product_image_bp.route("/api/product_image/image/<image_id>", methods=["PUT"])
def update_image(image_id):
    return update_product_image(image_id)

# Route: Xóa hình ảnh sản phẩm
@product_image_bp.route("/api/product_image/<image_id>", methods=["DELETE"])
def delete_image(image_id):
    return delete_product_image(image_id)

# Route: Thay đổi trạng thái mặc định cho hình ảnh
@product_image_bp.route("/api/product_image/image/<image_id>/default", methods=["PUT", "PATCH"])
def change_default(image_id):
    return change_default_image(image_id)
