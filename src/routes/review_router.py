from flask import Blueprint
from src.controllers.review_controller import (
    get_all_reviews,
    get_reviews_by_product,
    create_review,
)

review_bp = Blueprint("review", __name__)

# API lấy tất cả đánh giá (GET) & tạo mới review (POST)
@review_bp.route("/api/reviews", methods=["GET"])
def get_all_reviews_route():
    return get_all_reviews()

@review_bp.route("/api/reviews", methods=["POST"])
def create_review_route():
    return create_review()

# API lấy đánh giá theo product id (phân trang/tìm kiếm)
@review_bp.route("/api/reviews/product/<product_id>", methods=["GET"])
def get_reviews_by_product_route(product_id):
    return get_reviews_by_product(product_id)
