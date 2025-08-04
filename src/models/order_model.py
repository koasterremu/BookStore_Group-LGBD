from mongoengine import (
    Document, StringField, DateTimeField, FloatField, ReferenceField,
    ListField, IntField, BooleanField, CASCADE
)
import datetime

# Import User, AddressBook, OrderDetail sau khi có các model đó
# Để tránh lỗi circular import, dùng chuỗi tên class

class Order(Document):
    code = StringField(required=True)
    date = DateTimeField(default=datetime.datetime.utcnow)
    note = StringField()
    paymentMethod = StringField()
    totalPrice = FloatField(required=True)
    discount = FloatField(default=0)
    user = ReferenceField('User', required=True, reverse_delete_rule=CASCADE)
    addressBook = ReferenceField('AddressBook', required=True)
    status = StringField(required=True)
    orderDetails = ListField(ReferenceField('OrderDetail'))  # mảng reference

    meta = {
        'collection': 'orders'
    }
