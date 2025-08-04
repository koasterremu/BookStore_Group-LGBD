from mongoengine import Document, ReferenceField, StringField, IntField, DateTimeField
import datetime

class Review(Document):
    product = ReferenceField('Product', required=True)  # Tham chiếu đến Product
    user = ReferenceField('User', required=True)        # Tham chiếu đến User
    reviewText = StringField(required=True)             # Nội dung đánh giá
    rating = IntField(required=True, min_value=1, max_value=5)  # Đánh giá sao, từ 1 đến 5
    reviewDate = DateTimeField(default=datetime.datetime.utcnow) # Ngày đánh giá

    meta = {'collection': 'reviews'}
