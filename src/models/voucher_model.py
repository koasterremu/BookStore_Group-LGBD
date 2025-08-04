from mongoengine import Document, StringField, FloatField, DateTimeField, BooleanField

class Voucher(Document):
    code = StringField(required=True, unique=True)        # Mã giảm giá
    discount = FloatField(required=True)                  # Giá trị giảm giá
    expirationDate = DateTimeField(required=True)         # Ngày hết hạn
    isUsed = BooleanField(default=False)                  # Đánh dấu đã sử dụng

    meta = {'collection': 'vouchers'}
