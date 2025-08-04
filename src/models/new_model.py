from mongoengine import Document, StringField, DateTimeField, BooleanField
import datetime

class New(Document):
    title = StringField(required=True)
    content = StringField(required=True)          # Có thể chứa HTML
    publishDate = DateTimeField(default=datetime.datetime.utcnow)
    isDeleted = BooleanField(default=False)
    image = StringField()

    meta = {
        'collection': 'news'
    }
