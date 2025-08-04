from flask import Blueprint

from src.routes.category_router import category_bp
from src.routes.auth_router import auth_bp
from src.routes.revenue_router import revenue_bp

index_bp = Blueprint("index", __name__)

# index_bp.register_blueprint(category_bp,      url_prefix="/api/categories")
index_bp.register_blueprint(auth_bp,          url_prefix="/api/auth")
# index_bp.register_blueprint(user_bp,          url_prefix="/api/users")
# index_bp.register_blueprint(brand_bp,         url_prefix="/api/brands")
# index_bp.register_blueprint(news_bp,          url_prefix="/api/news")
# index_bp.register_blueprint(voucher_bp,       url_prefix="/api/vouchers")
# index_bp.register_blueprint(review_bp,        url_prefix="/api/reviews")
# index_bp.register_blueprint(product_bp,       url_prefix="/api/products")
# index_bp.register_blueprint(order_bp,         url_prefix="/api/orders")
# index_bp.register_blueprint(address_book_bp,  url_prefix="/api/addressbook")
# index_bp.register_blueprint(email_bp,         url_prefix="/api/email")
# index_bp.register_blueprint(vnpay_bp,         url_prefix="/api/vnpay")
index_bp.register_blueprint(revenue_bp,       url_prefix="/api/revenue")
