import os
from dotenv import load_dotenv
from src.app import app
from src.db.db_connect import init_db

load_dotenv()

PORT = int(os.getenv("PORT", 5001))

def main():
    init_db()
    app.run(host="0.0.0.0", port=PORT)

if __name__ == "__main__":
    main()
