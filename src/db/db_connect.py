# src/db/db_connect.py
import os
from dotenv import load_dotenv
from mongoengine import connect

# Load các biến môi trường từ .env
load_dotenv()

def init_db():
    mongo_url = os.getenv("MONGO_URL")
    if not mongo_url:
        raise ValueError("MONGO_URL is not set in .env file")
    # Kết nối mongoengine (bao gồm alias default)
    connect(host=mongo_url, alias="default")
    print("MongoEngine connected to DB successfully")
