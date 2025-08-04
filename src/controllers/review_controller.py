from flask import request, jsonify
from bson import ObjectId
from src.models.review_model import Review
from src.models.user_model import User
from src.models.product_model import Product
from src.utils.api_response import ApiResponse

def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except Exception:
        return False

def convert_objectid(data):
    if isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Đối tượng trả về cho user và product
def serialize_user(user):
    if not user:
        return None
    d = user.to_mongo().to_dict()
    d["_id"] = str(user.id)
    return convert_objectid(d)

def serialize_product(product):
    if not product:
        return None
    d = product.to_mongo().to_dict()
    d["_id"] = str(product.id)
    return convert_objectid(d)

# Lấy tất cả review với phân trang và search (populate)
def get_all_reviews():
    try:
        search_text = request.args.get("searchText")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        query = {}
        if search_text:
            query["reviewText__icontains"] = search_text

        reviews_qs = Review.objects(**query)
        total_elements = reviews_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        reviews = reviews_qs.skip(skip).limit(limit)

        review_dtos = []
        for r in reviews:
            dto = r.to_mongo().to_dict()
            # --- Populate user ---

            user_obj = None
            if isinstance(r.user, ObjectId):
                user_obj = User.objects(id=r.user).first()
            else:
                user_obj = r.user
            dto["user"] = serialize_user(user_obj) if user_obj else None

            # --- Populate product ---
            product_obj = None
            if isinstance(r.product, ObjectId):
                product_obj = Product.objects(id=r.product).first()
            else:
                product_obj = r.product
            dto["product"] = serialize_product(product_obj) if product_obj else None

            dto["_id"] = str(r.id)
            review_dtos.append(convert_objectid(dto))

        pagination_response = {
            "content": review_dtos,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages,
        }
        return jsonify(ApiResponse(200, pagination_response, "Lấy đánh giá thành công").to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy danh sách đánh giá").to_dict()), 500

# Lấy review theo sản phẩm
def get_reviews_by_product(product_id):
    try:
        if not is_valid_objectid(product_id):
            return jsonify(ApiResponse(400, None, "ID sản phẩm không hợp lệ").to_dict()), 400

        search_text = request.args.get("searchText")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        query = {"product": ObjectId(product_id)}
        if search_text:
            query["reviewText__icontains"] = search_text

        reviews_qs = Review.objects(**query)
        total_elements = reviews_qs.count()
        total_pages = (total_elements + limit - 1) // limit
        reviews = reviews_qs.skip(skip).limit(limit)

        review_dtos = []
        for r in reviews:
            dto = r.to_mongo().to_dict()
            # --- Populate user ---
            user_obj = None
            if isinstance(r.user, ObjectId):
                user_obj = User.objects(id=r.user).first()
            else:
                user_obj = r.user
            dto["user"] = serialize_user(user_obj) if user_obj else None
            # --- Populate product ---
            product_obj = None
            if isinstance(r.product, ObjectId):
                product_obj = Product.objects(id=r.product).first()
            else:
                product_obj = r.product
            dto["product"] = serialize_product(product_obj) if product_obj else None

            dto["_id"] = str(r.id)
            review_dtos.append(convert_objectid(dto))

        pagination_response = {
            "content": review_dtos,
            "page": page,
            "limit": limit,
            "totalElements": total_elements,
            "totalPages": total_pages,
        }
        return jsonify(ApiResponse(
            200, pagination_response, "Lấy đánh giá của sản phẩm thành công"
        ).to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi lấy đánh giá cho sản phẩm").to_dict()), 500

# Tạo mới review (populate chi tiết user, product)
def create_review():
    try:
        data = request.get_json()
        product_id  = data.get("productId")
        user_id     = data.get("userId")
        review_text = data.get("reviewText")
        rating      = data.get("rating")

        if not (is_valid_objectid(product_id) and is_valid_objectid(user_id)):
            return jsonify(ApiResponse(400, None, "ID không hợp lệ").to_dict()), 400

        review = Review(
            product=ObjectId(product_id),
            user=ObjectId(user_id),
            reviewText=review_text,
            rating=rating,
        )
        review.save()
        # Lấy lại & populate user, product
        r = Review.objects(id=review.id).first()
        dto = r.to_mongo().to_dict()
        user_obj = User.objects(id=r.user.id if hasattr(r.user, "id") else r.user).first()
        prod_obj = Product.objects(id=r.product.id if hasattr(r.product, "id") else r.product).first()
        dto["user"] = serialize_user(user_obj) if user_obj else None
        dto["product"] = serialize_product(prod_obj) if prod_obj else None

        dto["_id"] = str(r.id)
        dto = convert_objectid(dto)
        return jsonify(ApiResponse(201, dto, "Tạo đánh giá thành công").to_dict()), 201

    except Exception as e:
        print(e)
        return jsonify(ApiResponse(500, None, "Lỗi khi tạo đánh giá").to_dict()), 500
