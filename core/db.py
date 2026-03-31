from pymongo import MongoClient
from core.config import settings

_client = None
_db = None

def init_database():
    global _client, _db
    try:
        _client =MongoClient(settings.MONGODB_URI)
        _db = _client.get_database("chatbot")
        _client.admin.command('ping')
        print("MongoDB Atlas connection established successfully!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

def get_db():
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_database() first.")
    return _db