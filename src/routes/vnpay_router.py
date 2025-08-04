from flask import Blueprint
from src.controllers.vnpay_controller import (
    create_order,
    order_return,
)

vnpay_bp = Blueprint("vnpay", __name__)

# Route tạo URL thanh toán VNPay (GET /api/vnpay/payment)
@vnpay_bp.route("/api/vnpay/payment", methods=["GET"])
def create_order_route():
    return create_order()

# Route xử lý khi VNPay trả về kết quả thanh toán (GET /api/vnpay/paymentReturn)
@vnpay_bp.route("/api/vnpay/paymentReturn", methods=["GET"])
def order_return_route():
    return order_return()
