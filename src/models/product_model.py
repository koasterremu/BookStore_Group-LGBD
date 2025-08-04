from mongoengine import (
    Document, StringField, FloatField, IntField, BooleanField,
    ReferenceField, ListField
)

class Product(Document):
    productName = StringField(required=True)
    price = FloatField(required=True)
    description = StringField()
    discount = FloatField(default=0)
    badge = StringField()
    stock = IntField(default=0)
    isNewProduct = BooleanField(default=False)
    isSale = BooleanField(default=False)
    isSpecial = BooleanField(default=False)
    category = ReferenceField('Category')
    brand = ReferenceField('Brand')
    isDelete = BooleanField(default=False)
    variations = ListField(ReferenceField('ProductVariation'))
    images = ListField(ReferenceField('ProductImage'))
    __v = IntField(default=0) 

    meta = {'collection': 'products'}

    def get_default_image(self):
        if self.images and len(self.images) > 0:
            for image in self.images:
                if getattr(image, "isDefault", False):
                    return image
        return None
