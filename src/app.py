from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from src.routes.index_router import index_bp
from src.routes.product_router import product_bp
from src.routes.category_router import category_bp
from src.routes.brand_router import brand_bp
from src.routes.new_router import news_bp
from src.routes.voucher_router import voucher_bp
from src.routes.review_router import review_bp
from src.routes.product_image_router import product_image_bp
from src.routes.order_router import order_bp
from src.routes.address_book_router import address_book_bp
from src.routes.email_router import email_bp
from src.routes.user_router import user_bp
from src.routes.vnpay_router import vnpay_bp
from src.utils.api_response import ApiResponse
from src.services.mail_service import init_mail_config
from src.models import *
import os
os.environ["ACCESS_TOKEN_SECRET"] = "bookstorysecret"

app = Flask(__name__)

from flask_cors import CORS
load_dotenv()
CORS(
    app,
    resources={r"/*": {
        "origins": [
            "https://we-shine.vercel.app",
            "https://we-shine-admin.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
        ],
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"] 
    }}
)
with app.app_context():
    init_mail_config()
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    return send_from_directory(uploads_dir, filename)

app.register_blueprint(index_bp, url_prefix="/")
app.register_blueprint(product_bp)
app.register_blueprint(category_bp)
app.register_blueprint(brand_bp)
app.register_blueprint(review_bp)
app.register_blueprint(order_bp)
app.register_blueprint(address_book_bp)
app.register_blueprint(product_image_bp)
app.register_blueprint(news_bp)
app.register_blueprint(voucher_bp)
app.register_blueprint(email_bp)
app.register_blueprint(user_bp)
app.register_blueprint(vnpay_bp)

@app.errorhandler(404)
def not_found(error):
    return jsonify(ApiResponse(404, None, "No such route exists").to_dict()), 404

@app.errorhandler(Exception)
def handle_exception(error):
    print(error)
    return jsonify(ApiResponse(500, None, "An unexpected error occurred").to_dict()), 500
