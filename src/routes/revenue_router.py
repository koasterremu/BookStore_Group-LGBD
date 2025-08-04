from flask import Blueprint
from src.controllers.revenue_controller import (
    get_revenue_summary,
    get_daily_order_and_revenue,
)

revenue_bp = Blueprint("revenue", __name__)

# Lấy tóm tắt doanh thu
@revenue_bp.route("/summary", methods=["GET"])
def get_revenue_summary_route():
    return get_revenue_summary()

# Lấy dữ liệu từng ngày: doanh thu & số đơn hàng
@revenue_bp.route("/daily", methods=["GET"])
def get_daily_order_and_revenue_route():
    return get_daily_order_and_revenue()
