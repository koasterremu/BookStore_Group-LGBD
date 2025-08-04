from flask import request, jsonify
from src.config.vnpay_service import createOrderService, orderReturnService

# Controller tạo URL thanh toán VNPay
def create_order():
    try:
        amount     = request.args.get("amount", type=int)  # hoặc request.form.get
        order_info = request.args.get("orderInfo")
        return_url = request.args.get("returnUrl")
        if not amount or not order_info:
            return "Missing required parameters", 400

        payment_url = createOrderService(request, amount, order_info, return_url)
        return payment_url, 200  # Trả về chuỗi URL

    except Exception as e:
        print("Error creating payment URL:", e)
        return "Failed to create payment URL", 500

# Controller xử lý phản hồi/trả về của VNPay
def order_return():
    try:
        result = orderReturnService(request)
        if result == 1:
            return jsonify({"status": "SUCCESS", "message": "Giao dịch thành công!"}), 200
        elif result == 0:
            return jsonify({"status": "FAILED", "message": "Giao dịch thất bại!"}), 400
        else:
            return jsonify({"status": "INVALID", "message": "Giao dịch không hợp lệ!"}), 400
    except Exception as e:
        print("Error handling payment return:", e)
        return jsonify({"status": "ERROR", "message": "Failed to handle payment return"}), 500
