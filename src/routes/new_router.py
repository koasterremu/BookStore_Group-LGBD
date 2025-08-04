from flask import Blueprint
from src.controllers.new_controller import (
    get_all_news,
    get_new_by_id,
    create_new,
    update_new,
    delete_new,
)
from src.middlewares.auth_middleware import check_auth

news_bp = Blueprint("news", __name__)

# Lấy tất cả bản tin và tạo mới (POST cần check_auth)
@news_bp.route("/api/news", methods=["GET"])
def list_news():
    return get_all_news()

@news_bp.route("/api/news", methods=["POST"])
def create_news_route():
    # Gửi form-data với file "image"
    return create_new()

# Lấy, cập nhật, xóa bản tin theo ID (PUT/DELETE cần check_auth)
@news_bp.route("/api/news/<id>", methods=["GET"])
def get_news(id):
    return get_new_by_id(id)

@news_bp.route("/api/news/<id>", methods=["PUT"])
def update_news_route(id):
    return update_new(id)

@news_bp.route("/api/news/<id>", methods=["DELETE"])
def delete_news_route(id):
    return delete_new(id)
