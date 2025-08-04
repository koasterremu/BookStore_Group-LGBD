from flask import Blueprint
from src.controllers.email_controller import send_order_confirmation_email

email_bp = Blueprint("email", __name__)

# Định nghĩa route gửi email xác nhận đơn hàng
@email_bp.route("/api/email/sendOrderConfirmation", methods=["POST"])
def send_order_confirmation():
    return send_order_confirmation_email()
