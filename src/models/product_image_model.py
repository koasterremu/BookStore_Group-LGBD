from mongoengine import Document, ReferenceField, StringField, BooleanField

class ProductImage(Document):
    product = ReferenceField('Product', required=True)
    imageUrl = StringField(required=True)
    isDelete = BooleanField(default=False)
    isDefault = BooleanField(default=False)

    meta = {'collection': 'productimages'}
