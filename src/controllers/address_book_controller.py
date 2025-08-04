from flask import request, jsonify
from mongoengine.errors import ValidationError, DoesNotExist
from bson import ObjectId
from src.models.addressBook_model import AddressBook
from src.utils.api_response import ApiResponse

# Helper kiểm tra ObjectId hợp lệ (giống mongoose.Types.ObjectId.isValid)
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

# Helper CHUYỂN ObjectId=>str trong dict/list sâu lồng nhau
def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# GET: Lấy danh sách AddressBook theo userId
def get_address_book_by_user_id(user_id):
    if not is_valid_objectid(user_id):
        return jsonify(ApiResponse(400, None, "ID người dùng không hợp lệ").to_dict()), 400
    try:
        address_books = AddressBook.objects(user=user_id).all()
        data = [convert_objectid(ab.to_mongo().to_dict()) for ab in address_books]
        return jsonify(ApiResponse(200, data, "Lấy danh sách địa chỉ thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách địa chỉ").to_dict()), 500

# POST: Tạo mới AddressBook
def create_address_book(user_id):
    if not is_valid_objectid(user_id):
        return jsonify(ApiResponse(400, None, "ID người dùng không hợp lệ").to_dict()), 400
    data = request.get_json()
    try:
        new_address = AddressBook(
            user=user_id,
            recipientName=data.get('recipientName'),
            phoneNumber=data.get('phoneNumber'),
            address=data.get('address'),
            ward=data.get('ward'),
            district=data.get('district'),
            city=data.get('city'),
            email=data.get('email'),
        )
        new_address.save()
        result = convert_objectid(new_address.to_mongo().to_dict())
        return jsonify(ApiResponse(201, result, "Tạo địa chỉ mới thành công").to_dict()), 201
    except ValidationError as e:
        print(e)
        return jsonify(ApiResponse(400, None, "Dữ liệu gửi lên không hợp lệ").to_dict()), 400
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo địa chỉ mới").to_dict()), 500

# PUT: Cập nhật AddressBook
def update_address_book(address_book_id):
    if not is_valid_objectid(address_book_id):
        return jsonify(ApiResponse(400, None, "ID địa chỉ không hợp lệ").to_dict()), 400
    data = request.get_json()
    try:
        updated = AddressBook.objects(id=address_book_id).modify(
            set__recipientName=data.get('recipientName'),
            set__phoneNumber=data.get('phoneNumber'),
            set__address=data.get('address'),
            set__ward=data.get('ward'),
            set__district=data.get('district'),
            set__city=data.get('city'),
            set__email=data.get('email'),
            new=True
        )
        if not updated:
            return jsonify(ApiResponse(404, None, "Không tìm thấy địa chỉ").to_dict()), 404

        result = convert_objectid(updated.to_mongo().to_dict())
        return jsonify(ApiResponse(200, result, "Cập nhật địa chỉ thành công").to_dict()), 200
    except ValidationError as e:
        print(e)
        return jsonify(ApiResponse(400, None, "Dữ liệu gửi lên không hợp lệ").to_dict()), 400
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật địa chỉ").to_dict()), 500

# DELETE: Xóa AddressBook
def delete_address_book(address_book_id):
    if not is_valid_objectid(address_book_id):
        return jsonify(ApiResponse(400, None, "ID địa chỉ không hợp lệ").to_dict()), 400
    try:
        address = AddressBook.objects(id=address_book_id).first()
        if not address:
            return jsonify(ApiResponse(404, None, "Không tìm thấy địa chỉ").to_dict()), 404

        address.delete()
        return jsonify(ApiResponse(200, None, "Xóa địa chỉ thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi xóa địa chỉ").to_dict()), 500
