from flask import Blueprint
from src.controllers.address_book_controller import (
    get_address_book_by_user_id,
    create_address_book,
    update_address_book,
    delete_address_book,
)

address_book_bp = Blueprint("address_book", __name__)

# Lấy danh sách AddressBook theo userId
@address_book_bp.route('/api/addressbook/user/<user_id>', methods=['GET'])
def get_by_user_id(user_id):
    return get_address_book_by_user_id(user_id)

# Tạo mới AddressBook theo userId
@address_book_bp.route('/api/addressbook/user/<user_id>', methods=['POST'])
def create_for_user(user_id):
    return create_address_book(user_id)

# Cập nhật AddressBook theo addressBookId
@address_book_bp.route('/api/addressbook/<address_book_id>', methods=['PUT'])
def update_by_id(address_book_id):
    return update_address_book(address_book_id)

# Xóa AddressBook theo addressBookId
@address_book_bp.route('/api/addressbook/<address_book_id>', methods=['DELETE'])
def delete_by_id(address_book_id):
    return delete_address_book(address_book_id)
