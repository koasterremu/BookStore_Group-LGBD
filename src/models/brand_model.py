from mongoengine import Document, StringField, BooleanField, DateTimeField
import datetime

class Brand(Document):
    brandName = StringField(required=True)
    image = StringField()
    description = StringField()
    isDelete = BooleanField(default=False)
    createdAt = DateTimeField(default=datetime.datetime.utcnow)

    meta = {'collection': 'brands'}
