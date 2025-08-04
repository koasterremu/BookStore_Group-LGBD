from functools import wraps
from flask import request, jsonify
import jwt
import os
from src.utils.api_response import ApiResponse

ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

def check_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            bearer_auth = request.headers.get("Authorization", None)
            if not bearer_auth:
                return jsonify(ApiResponse(400, None, "Missing header authorization").to_dict()), 400

            # Thường header có dạng "Bearer <token>"
            parts = bearer_auth.split()
            if len(parts) != 2 or parts[0].lower() != "bearer":
                return jsonify(ApiResponse(400, None, "Invalid Authorization header format").to_dict()), 400

            token = parts[1]
            if not token:
                return jsonify(ApiResponse(400, None, "No Token entered").to_dict()), 400

            try:
                user_data = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return jsonify(ApiResponse(401, None, "Token expired!").to_dict()), 401
            except jwt.InvalidTokenError:
                return jsonify(ApiResponse(401, None, "Invalid Token").to_dict()), 401

            # Bạn có thể attach user_data vào Flask request context nếu muốn
            request.user = user_data

            return func(*args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"message": str(e)}), 500

    return wrapper
