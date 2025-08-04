from flask import request, jsonify
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from bson import ObjectId
from src.models.order_model import Order
from src.models.product_model import Product
from src.models.user_model import User
from src.utils.api_response import ApiResponse

def calculate_total_revenue(start, end):
    pipeline = [
        {"$match": {"date": {"$gte": start, "$lt": end}}},
        {"$group": {"_id": None, "totalRevenue": {"$sum": "$totalPrice"}}},
    ]
    result = list(Order.objects.aggregate(*pipeline))
    return result[0]["totalRevenue"] if result else 0

# Lấy tóm tắt doanh thu
def get_revenue_summary():
    try:
        now = datetime.now()
        today_start = datetime(now.year, now.month, now.day)
        today_end = today_start + timedelta(days=1, microseconds=-1)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_end = today_end - timedelta(days=1)
        month_start = datetime(now.year, now.month, 1)
        last_month_start = (month_start - relativedelta(months=1)).replace(day=1)
        last_month_end = month_start - timedelta(microseconds=1)
        year_start = datetime(now.year, 1, 1)
        last_year_start = year_start - relativedelta(years=1)
        last_year_end = year_start - timedelta(microseconds=1)

        # Tính doanh thu
        today_revenue = calculate_total_revenue(today_start, today_end)
        yesterday_revenue = calculate_total_revenue(yesterday_start, yesterday_end)
        monthly_revenue = calculate_total_revenue(month_start, today_end)
        last_month_revenue = calculate_total_revenue(last_month_start, last_month_end)
        yearly_revenue = calculate_total_revenue(year_start, today_end)
        last_year_revenue = calculate_total_revenue(last_year_start, last_year_end)

        # Thống kê tổng sản phẩm, đơn hàng và người dùng
        total_products = Product.objects(isDelete=False).count()
        total_orders = Order.objects.count()
        total_users = User.objects(isDelete=False).count()

        # Tính phần trăm tăng trưởng
        today_increase_percentage = (
            ((today_revenue - yesterday_revenue) * 100) / yesterday_revenue
            if yesterday_revenue > 0
            else 0
        )
        monthly_increase_percentage = (
            ((monthly_revenue - last_month_revenue) * 100) / last_month_revenue
            if last_month_revenue > 0
            else 0
        )
        yearly_increase_percentage = (
            ((yearly_revenue - last_year_revenue) * 100) / last_year_revenue
            if last_year_revenue > 0
            else 0
        )

        return jsonify({
            "todayRevenue": today_revenue,
            "yesterdayRevenue": yesterday_revenue,
            "todayIncreasePercentage": today_increase_percentage,
            "monthlyRevenue": monthly_revenue,
            "lastMonthRevenue": last_month_revenue,
            "monthlyIncreasePercentage": monthly_increase_percentage,
            "yearlyRevenue": yearly_revenue,
            "lastYearRevenue": last_year_revenue,
            "yearlyIncreasePercentage": yearly_increase_percentage,
            "totalProducts": total_products,
            "totalOrders": total_orders,
            "totalUsers": total_users,
        }), 200

    except Exception as e:
        print("Error fetching revenue summary:", e)
        return jsonify({"message": "Failed to fetch revenue summary"}), 500

# Lấy dữ liệu đơn hàng & doanh thu theo ngày (chart)
def get_daily_order_and_revenue():
    try:
        start_date_str = request.args.get("startDate")
        end_date_str = request.args.get("endDate")
        if not start_date_str or not end_date_str:
            return jsonify({"message": "startDate and endDate query parameters are required"}), 400

        # Parse ngày từ query param (định dạng ISO, ví dụ '2025-07-01')
        start_date = datetime.fromisoformat(start_date_str).replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.fromisoformat(end_date_str).replace(hour=23, minute=59, second=59, microsecond=999999)

        pipeline = [
            {"$match": {"date": {"$gte": start_date, "$lte": end_date}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {"$add": ["$date", 7 * 60 * 60 * 1000]}  # UTC+7 offset
                        }
                    },
                    "orderCount": {"$sum": 1},
                    "totalRevenue": {"$sum": "$totalPrice"},
                }
            },
            {"$sort": {"_id": 1}},
        ]

        results = list(Order.objects.aggregate(*pipeline))

        categories = [r["_id"] for r in results]
        order_counts = [r["orderCount"] for r in results]
        revenues = [r["totalRevenue"] for r in results]

        return jsonify({
            "series": [
                {"name": "Số đơn hàng", "data": order_counts},
                {"name": "Doanh thu", "data": revenues},
            ],
            "categories": categories,
        }), 200

    except Exception as e:
        print("Error fetching daily order and revenue:", e)
        return jsonify({"message": "Failed to fetch daily order and revenue"}), 500
