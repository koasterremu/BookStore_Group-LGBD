from mongoengine import (
    Document, ReferenceField, IntField, FloatField, NULLIFY
)

class OrderDetail(Document):
    order = ReferenceField('Order', required=True, reverse_delete_rule=NULLIFY)
    product = ReferenceField('Product', required=True, reverse_delete_rule=NULLIFY)
    productVariation = ReferenceField('ProductVariation', required=False, null=True, default=None, reverse_delete_rule=NULLIFY)
    quantity = IntField(required=True)
    price = FloatField(required=True)   # bạn có thể dùng DecimalField nếu muốn độ chính xác cao hơn

    meta = {
        'collection': 'orderdetails'
    }
