import firebase_admin
from firebase_admin import credentials, storage
import uuid
from PIL import Image
import io
import os
from pathlib import Path

# Đường dẫn tới service account key (có thể lấy từ biến môi trường hoặc path cứng)
SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "config" / "firebase" / "serviceAccountKey.json"
BUCKET_NAME = "shop-a080e.appspot.com"

# Khởi tạo nếu chưa có (tránh khởi tạo lại)
if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
    firebase_admin.initialize_app(cred, {
        "storageBucket": BUCKET_NAME
    })

bucket = storage.bucket()

def upload_image_to_firebase(file_buffer, file_name, compress=False):
    try:
        if not isinstance(file_buffer, (bytes, bytearray)):
            raise TypeError("The file_buffer argument must be bytes.")

        buffer_to_upload = file_buffer

        if compress:
            # Đọc bytes -> PIL Image -> resize -> bytes (JPEG)
            img = Image.open(io.BytesIO(file_buffer))
            img = img.convert("RGB")
            img = img.resize((800, int(800*img.height/img.width)))
            out = io.BytesIO()
            img.save(out, format="JPEG", quality=80)
            buffer_to_upload = out.getvalue()

        remote_file_name = f"images/{uuid.uuid4()}-{file_name}"
        blob = bucket.blob(remote_file_name)
        token = str(uuid.uuid4())

        blob.upload_from_string(buffer_to_upload, content_type="image/jpeg")
        blob.metadata = {
            "firebaseStorageDownloadTokens": token
        }
        blob.patch()

        image_url = (
            f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/"
            f"{remote_file_name.replace('/', '%2F')}?alt=media"
        )
        print("Uploaded image URL:", image_url)
        return image_url
    except Exception as e:
        print("Error during image upload:", e)
        raise

def upload_file_to_firebase(file_buffer, file_name, content_type):
    try:
        remote_file_name = f"cv/{uuid.uuid4()}-{file_name}"
        blob = bucket.blob(remote_file_name)
        token = str(uuid.uuid4())

        blob.upload_from_string(file_buffer, content_type=content_type)
        blob.metadata = {
            "firebaseStorageDownloadTokens": token
        }
        blob.patch()

        file_url = (
            f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/"
            f"{remote_file_name.replace('/', '%2F')}?alt=media"
        )
        print("Uploaded file URL:", file_url)
        return file_url
    except Exception as e:
        print("Error during file upload:", e)
        raise
