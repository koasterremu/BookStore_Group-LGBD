from flask import request, jsonify
from bson import ObjectId
from datetime import datetime
from src.models.voucher_model import Voucher
from src.utils.api_response import ApiResponse

# Helper đệ quy chuyển ObjectId về str
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Lấy tất cả các voucher với phân trang & search
def get_all_vouchers():
    try:
        keyword = request.args.get("keyword")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        query = {}
        if keyword:
            query["code__icontains"] = keyword

        vouchers_qs = Voucher.objects(**query)
        total_elements = vouchers_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        vouchers = vouchers_qs.skip(skip).limit(limit)
        data = [convert_objectid(v.to_mongo().to_dict()) for v in vouchers]

        pagination_response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy danh sách voucher thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách voucher").to_dict()), 500

# Tạo voucher mới
def create_voucher():
    try:
        data = request.get_json()
        code = data.get("code")
        discount = data.get("discount")
        expiration_date = data.get("expirationDate")

        voucher = Voucher(
            code=code,
            discount=discount,
            expirationDate=expiration_date,
            isUsed=False
        )
        voucher.save()
        voucher_data = convert_objectid(voucher.to_mongo().to_dict())
        return jsonify(ApiResponse(201, voucher_data, "Tạo voucher thành công").to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo voucher").to_dict()), 500

# Cập nhật voucher
def update_voucher(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        data = request.get_json()
        code = data.get("code")
        discount = data.get("discount")
        expiration_date = data.get("expirationDate")

        voucher = Voucher.objects(id=id).first()
        if not voucher:
            return jsonify(ApiResponse(404, None, "Không tìm thấy voucher").to_dict()), 404
        voucher.code = code
        voucher.discount = discount
        voucher.expirationDate = expiration_date
        voucher.save()
        voucher_data = convert_objectid(voucher.to_mongo().to_dict())
        return jsonify(ApiResponse(200, voucher_data, "Cập nhật voucher thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật voucher").to_dict()), 500

# Xóa voucher thật sự
def delete_voucher(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        voucher = Voucher.objects(id=id).first()
        if not voucher:
            return jsonify(ApiResponse(404, None, "Không tìm thấy voucher").to_dict()), 404
        voucher.delete()
        return jsonify(ApiResponse(200, None, "Xóa voucher thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa voucher").to_dict()), 500

# Đánh dấu voucher là đã sử dụng
def mark_voucher_as_used(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        voucher = Voucher.objects(id=id).first()
        if not voucher:
            return jsonify(ApiResponse(404, None, "Không tìm thấy voucher").to_dict()), 404
        voucher.isUsed = True
        voucher.save()
        voucher_data = convert_objectid(voucher.to_mongo().to_dict())
        return jsonify(ApiResponse(200, voucher_data, "Voucher đã được đánh dấu là đã sử dụng").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi đánh dấu voucher là đã sử dụng").to_dict()), 500

# Kiểm tra mã voucher (check hợp lệ, chưa dùng, chưa hết hạn)
def check_voucher_code(code):
    try:
        voucher = Voucher.objects(
            code=code,
            isUsed=False,
            expirationDate__gt=datetime.utcnow()
        ).first()
        if not voucher:
            return jsonify(ApiResponse(404, None, "Voucher không hợp lệ hoặc đã hết hạn").to_dict()), 404
        voucher_data = convert_objectid(voucher.to_mongo().to_dict())
        return jsonify(ApiResponse(200, voucher_data, "Voucher hợp lệ").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi kiểm tra voucher").to_dict()), 500

# Thay đổi trạng thái sử dụng của voucher (toggle)
def change_voucher_status(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        voucher = Voucher.objects(id=id).first()
        if not voucher:
            return jsonify(ApiResponse(404, None, "Không tìm thấy voucher").to_dict()), 404
        voucher.isUsed = not voucher.isUsed
        voucher.save()
        voucher_data = convert_objectid(voucher.to_mongo().to_dict())
        return jsonify(ApiResponse(200, voucher_data, "Thay đổi trạng thái voucher thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi thay đổi trạng thái voucher").to_dict()), 500
