from mongoengine import Document, StringField, BooleanField
from mongoengine import EmailField
from flask_jwt_extended import create_access_token, create_refresh_token
import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phoneNumber = StringField()
    fullName = StringField()
    avatar = StringField()
    resetPasswordToken = StringField()
    role = StringField(required=True, choices=["ADMIN", "STAFF", "CUSTOMER"])
    address = StringField()
    isDelete = BooleanField(default=False)
    active = BooleanField(default=True)

    meta = {'collection': 'users'}

    def generate_access_token(self):
        # Tạo access token JWT (sử dụng flask-jwt-extended)
        identity = {"id": str(self.id), "role": self.role}
        return create_access_token(identity=identity, expires_delta=datetime.timedelta(days=1))

    def generate_refresh_token(self):
        # Tạo refresh token JWT
        identity = {"id": str(self.id), "role": self.role}
        return create_refresh_token(identity=identity, expires_delta=datetime.timedelta(days=7))

    def is_enabled(self):
        return not self.isDelete
