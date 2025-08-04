from flask import request, jsonify
from bson.objectid import ObjectId
from mongoengine.queryset.visitor import Q

from src.models.product_model import Product
from src.models.review_model import Review
from src.models.category_model import Category
from src.models.order_model import Order
from src.models.order_detail_model import OrderDetail
from src.models.brand_model import Brand
from src.models.product_variation_model import ProductVariation
from src.models.product_image_model import ProductImage
from src.utils.api_response import ApiResponse
from src.services.firebase_service import upload_file_to_firebase
import random
import json
import traceback

def is_valid_objectid(id_str):
    # Check cả ObjectId, str id
    try:
        if isinstance(id_str, ObjectId):
            return True
        ObjectId(str(id_str))
        return True
    except Exception:
        return False

def convert_objectid(data):
    # Đệ quy convert ObjectId về str
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

def serialize_category(cat):
    if not cat:
        return None
    # nếu là str id
    if isinstance(cat, str) and is_valid_objectid(cat):
        cat = Category.objects(id=ObjectId(cat)).first()
        if not cat:
            return None
    if isinstance(cat, ObjectId):
        cat = Category.objects(id=cat).first()
        if not cat:
            return None
    if not hasattr(cat, "to_mongo"):
        return None
    d = cat.to_mongo().to_dict()
    d["_id"] = str(cat.id)
    return convert_objectid(d)

def serialize_brand(brand):
    if not brand:
        return None
    if isinstance(brand, str) and is_valid_objectid(brand):
        brand = Brand.objects(id=ObjectId(brand)).first()
        if not brand:
            return None
    if isinstance(brand, ObjectId):
        brand = Brand.objects(id=brand).first()
        if not brand:
            return None
    if not hasattr(brand, "to_mongo"):
        return None
    d = brand.to_mongo().to_dict()
    d["_id"] = str(brand.id)
    return convert_objectid(d)

def serialize_image(img):
    if not img:
        return None
    img_id = img.id if hasattr(img, "id") else img
    if isinstance(img, str) and is_valid_objectid(img):
        img = ProductImage.objects(id=ObjectId(img)).first()
        if not img:
            return None
    elif isinstance(img, ObjectId):
        img = ProductImage.objects(id=img).first()
        if not img:
            return None
    if not hasattr(img, "to_mongo"):
        return None
    d = img.to_mongo().to_dict()
    d["_id"] = str(img.id)
    d["product"] = str(img.product.id) if getattr(img, "product", None) else None
    return convert_objectid(d)

def serialize_variation(variation):
    if not variation:
        return None
    var_id = variation.id if hasattr(variation, "id") else variation
    if isinstance(variation, str) and is_valid_objectid(variation):
        variation = ProductVariation.objects(id=ObjectId(variation)).first()
        if not variation:
            return None
    elif isinstance(variation, ObjectId):
        variation = ProductVariation.objects(id=variation).first()
        if not variation:
            return None
    if not hasattr(variation, "to_mongo"):
        return None
    d = variation.to_mongo().to_dict()
    d["_id"] = str(variation.id)
    d["product"] = str(variation.product.id) if getattr(variation, "product", None) else None
    return convert_objectid(d)

def serialize_product(p, with_review=True):
    if not p:
        return None
    obj = p.to_mongo().to_dict()
    obj["_id"] = str(p.id)
    obj["category"] = serialize_category(p.category)
    obj["brand"] = serialize_brand(p.brand)
    # Serialize images
    images = []
    if hasattr(p, "images") and p.images:
        for img in p.images:
            res = serialize_image(img)
            if res:
                images.append(res)
    obj["images"] = images
    # Serialize variations
    variations = []
    if hasattr(p, "variations") and p.variations:
        for v in p.variations:
            res = serialize_variation(v)
            if res:
                variations.append(res)
    obj["variations"] = variations
    # Reviews
    if with_review:
        reviews = Review.objects(product=p.id)
        review_count = reviews.count()
        avg_rating = round(sum([r.rating for r in reviews]) / review_count, 2) if review_count else 0
        obj["avgRating"] = avg_rating
        obj["reviewCount"] = review_count
    obj = convert_objectid(obj)
    return obj

def recommend_products():
    try:
        user_id = request.args.get("userId")
        recommended_products = []
        if user_id:
            orders = Order.objects(user=ObjectId(user_id)).only("id")
            order_ids = [o.id for o in orders]
            order_details = OrderDetail.objects(order__in=order_ids).only("product")
            product_ids = list({od.product.id for od in order_details if od.product})
            recommended_products = list(
                Product.objects(
                    id__in=product_ids,
                    isDelete=False
                ).limit(10)
            )
        else:
            total = Product.objects(isDelete=False).count()
            offset = 0
            if total > 10:
                offset = random.randint(0, total - 10)
            recommended_products = list(Product.objects(isDelete=False).skip(offset).limit(10))
        data = [serialize_product(p, with_review=False) for p in recommended_products]
        return jsonify(ApiResponse(200, data, "Gợi ý sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi gợi ý sản phẩm").to_dict()), 500

def get_all_products():
    try:
        search         = request.args.get("search")
        category_id    = request.args.get("categoryId")
        brand_id       = request.args.get("brandId")
        page           = int(request.args.get("page", 1))
        limit          = int(request.args.get("limit", 10))
        sort_field     = request.args.get("sortField", "productName")
        sort_direction = request.args.get("sortDirection", "asc")
        skip = (page - 1) * limit
        sort = f"{'' if sort_direction == 'asc' else '-'}{sort_field}"
        query = Q(isDelete=False)
        if search:
            query &= Q(productName__icontains=search)
        if category_id and is_valid_objectid(category_id):
            query &= Q(category=ObjectId(category_id))
        if brand_id and is_valid_objectid(brand_id):
            query &= Q(brand=ObjectId(brand_id))
        products_qs = Product.objects(query).order_by(sort)
        total_elements = products_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        products = products_qs.skip(skip).limit(limit)
        data = [serialize_product(p, with_review=True) for p in products]
        response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages,
        }
        return jsonify(ApiResponse(200, response, "Lấy danh sách sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách sản phẩm").to_dict()), 500

def get_product_by_id(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        product = Product.objects(id=ObjectId(id)).first()
        if not product or product.isDelete:
            return jsonify(ApiResponse(404, None, "Sản phẩm không tồn tại").to_dict()), 404
        product_dict = serialize_product(product, with_review=True)
        return jsonify(ApiResponse(200, product_dict, "Lấy sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy chi tiết sản phẩm").to_dict()), 500

def create_product():
    try:
        body = request.form
        productName    = body.get("productName")
        price          = float(body.get("price", 0))
        description    = body.get("description")
        discount       = float(body.get("discount", 0))
        badge          = body.get("badge")
        stock          = int(body.get("stock", 0))
        isNewProduct   = body.get("isNewProduct", "false").lower() == "true"
        isSale         = body.get("isSale", "false").lower() == "true"
        isSpecial      = body.get("isSpecial", "false").lower() == "true"
        categoryId     = body.get("categoryId")
        brandId        = body.get("brandId")
        images         = request.files.getlist("images")
        variations_str = body.get("variations", "[]")
        variations     = json.loads(variations_str) if variations_str else []
        category = Category.objects(id=ObjectId(categoryId)).first() if categoryId and is_valid_objectid(categoryId) else None
        brand = Brand.objects(id=ObjectId(brandId)).first() if brandId and is_valid_objectid(brandId) else None
        if not category or not brand:
            return jsonify(ApiResponse(400, None, "Danh mục hoặc thương hiệu không hợp lệ").to_dict()), 400
        product = Product(
            productName=productName, price=price, description=description, discount=discount,
            badge=badge, stock=stock, isNewProduct=isNewProduct, isSale=isSale, isSpecial=isSpecial,
            category=category, brand=brand
        )
        product.save()
        for idx, image_file in enumerate(images):
            buf = image_file.read()
            image_url = upload_file_to_firebase(buf, image_file.filename, image_file.content_type)
            product_image = ProductImage(product=product, imageUrl=image_url, isDefault=(idx==0))
            product_image.save()
            product.images.append(product_image)
        product.save()
        for vdata in variations:
            variation = ProductVariation(
                product = product,
                attributeName = vdata.get("attributeName"),
                attributeValue = vdata.get("attributeValue"),
                price = vdata.get("price", 0),
                quantity = vdata.get("quantity", 0),
                isDelete = False,
            )
            variation.save()
            product.variations.append(variation)
        product.save()
        result = serialize_product(product, with_review=True)
        return jsonify(ApiResponse(201, result, "Tạo sản phẩm thành công").to_dict()), 201
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo sản phẩm").to_dict()), 500

def update_product(id):
    try:
        body = request.form
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        product = Product.objects(id=ObjectId(id)).first()
        if not product or product.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy sản phẩm").to_dict()), 404
        product.productName    = body.get("productName")
        product.price          = float(body.get("price", 0))
        product.description    = body.get("description")
        product.discount       = float(body.get("discount", 0))
        product.badge          = body.get("badge")
        product.stock          = int(body.get("stock", 0))
        product.isNewProduct   = body.get("isNewProduct", "false").lower() == "true"
        product.isSale         = body.get("isSale", "false").lower() == "true"
        product.isSpecial      = body.get("isSpecial", "false").lower() == "true"
        cat_id = body.get("categoryId")
        brand_id = body.get("brandId")
        if cat_id and is_valid_objectid(cat_id):
            category = Category.objects(id=ObjectId(cat_id)).first()
            if category: product.category = category
        if brand_id and is_valid_objectid(brand_id):
            brand = Brand.objects(id=ObjectId(brand_id)).first()
            if brand: product.brand = brand
        images = request.files.getlist("images")
        if images and len(images) > 0:
            for img in product.images:
                ProductImage.objects(id=img.id).delete()
            product.images = []
            for idx, image_file in enumerate(images):
                buf = image_file.read()
                image_url = upload_file_to_firebase(buf, image_file.filename, image_file.content_type)
                product_image = ProductImage(product=product, imageUrl=image_url, isDefault=(idx==0))
                product_image.save()
                product.images.append(product_image)
        variations_str = body.get("variations", "[]")
        variations = json.loads(variations_str) if variations_str else []
        if variations:
            ProductVariation.objects(product=product).delete()
            product.variations = []
            for vdata in variations:
                variation = ProductVariation(
                    product = product,
                    attributeName = vdata.get("attributeName"),
                    attributeValue = vdata.get("attributeValue"),
                    price = vdata.get("price", 0),
                    quantity = vdata.get("quantity", 0),
                    isDelete = False,
                )
                variation.save()
                product.variations.append(variation)
        product.save()
        result = serialize_product(product, with_review=True)
        return jsonify(ApiResponse(200, result, "Cập nhật sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi cập nhật sản phẩm").to_dict()), 500

def delete_product(id):
    try:
        if not is_valid_objectid(id):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400
        product = Product.objects(id=ObjectId(id)).first()
        if not product or product.isDelete:
            return jsonify(ApiResponse(404, None, "Không tìm thấy sản phẩm").to_dict()), 404
        product.isDelete = True
        product.save()
        return jsonify(ApiResponse(200, None, "Xoá sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi xoá sản phẩm").to_dict()), 500

def get_filtered_products():
    try:
        is_new = request.args.get("isNewProduct")
        is_sale = request.args.get("isSale")
        is_special = request.args.get("isSpecial")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit
        query = Q(isDelete=False)
        if is_new is not None:
            query &= Q(isNewProduct=is_new.lower() == "true")
        if is_sale is not None:
            query &= Q(isSale=is_sale.lower() == "true")
        if is_special is not None:
            query &= Q(isSpecial=is_special.lower() == "true")
        products_qs = Product.objects(query)
        total_elements = products_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        products = products_qs.skip(skip).limit(limit)
        data = [serialize_product(p, with_review=True) for p in products]
        response = {
            "content": data,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages,
        }
        return jsonify(ApiResponse(200, response, "Lấy danh sách sản phẩm thành công").to_dict()), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách sản phẩm").to_dict()), 500

