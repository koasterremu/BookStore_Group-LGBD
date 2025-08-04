from mongoengine import Document, ReferenceField, StringField, FloatField, IntField, BooleanField

class ProductVariation(Document):
    product = ReferenceField('Product', required=True)
    attributeName = StringField(required=True)  # ex: 'Color', 'RAM'
    attributeValue = StringField(required=True) # ex: 'Red', '128GB'
    price = FloatField(required=True)
    quantity = IntField(required=True)
    isDelete = BooleanField(default=False)

    meta = {'collection': 'productvariations'}
