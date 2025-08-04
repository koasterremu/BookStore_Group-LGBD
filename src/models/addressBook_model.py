from mongoengine import Document, StringField, ReferenceField, ObjectIdField, EmailField
from src.models.user_model import User

class AddressBook(Document):
    user = ReferenceField('User', required=True)  # Tham chiếu tới User
    recipientName = StringField(required=True)
    phoneNumber = StringField(required=True)
    address = StringField(required=True)
    ward = StringField(required=True)
    district = StringField(required=True)
    city = StringField(required=True)
    email = EmailField(required=True)

    meta = {'collection': 'addressbooks'}  # tên collection giống bản gốc, bạn có thể tuỳ biến
