from flask import Blueprint
from src.controllers.order_controller import (
    create_order,
    get_all_orders,
    get_orders_by_user_id,
    change_order_status,
)
from src.middlewares.auth_middleware import check_auth

order_bp = Blueprint("order", __name__)

# Đặt order mới (POST /create - cần xác thực)
@order_bp.route("/api/orders/create", methods=["POST"])
def create_order_route():
    return create_order()

# Lấy tất cả đơn hàng (GET /all - cần xác thực)
@order_bp.route("/api/orders/all", methods=["GET"])
def get_all_orders_route():
    return get_all_orders()

# Lấy đơn theo user (GET /user/<user_id> - cần xác thực)
@order_bp.route("/api/orders/user/<user_id>", methods=["GET"])
def get_orders_by_user_route(user_id):
    return get_orders_by_user_id(user_id)

# Đổi trạng thái đơn hàng (PUT /<orderId>/status - cần xác thực)
@order_bp.route("/api/orders/<order_id>/status", methods=["PUT"])
def change_order_status_route(order_id):
    return change_order_status(order_id)
