from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError

from core.db import get_db
from model.mongo_model import conversation_doc, message_doc, user_doc

CONVERSATIONS = "conversations"
MESSAGES = "messages"
USERS = "users"


def start_new_conversation(user_id: str):
    try:
        db = get_db()
        doc = conversation_doc(user_id)
        result = db[CONVERSATIONS].insert_one(doc)
        return str(result.inserted_id)
    except PyMongoError as e:
        raise RuntimeError(f"Failed to create conversation: {e}") from e


def save_message(role: str, content: str, conversation_id: str) -> None:
    try:
        conv_oid = ObjectId(conversation_id)
    except (InvalidId, TypeError) as e:
        raise ValueError(f"Invalid conversation_id: {conversation_id}") from e

    try:
        db = get_db()
        msg = message_doc(role, content, conv_oid)
        db[MESSAGES].insert_one(msg)

        db[CONVERSATIONS].update_one(
            {"_id": conv_oid},
            {"$set": {"updated_at": msg["created_at"]}},
        )
    except PyMongoError as e:
        raise RuntimeError(f"Failed to save message: {e}") from e


def get_conversation(conversation_id: str) -> list[dict] | None:
    try:
        conv_oid = ObjectId(conversation_id)
    except (InvalidId, TypeError) as e:
        raise ValueError(f"Invalid conversation_id: {conversation_id}") from e

    try:
        db = get_db()
        conversation = db[CONVERSATIONS].find_one({"_id": conv_oid})
        if not conversation:
            return None
        cursor = db[MESSAGES].find({"conversation_id": conv_oid}, ).sort("created_at", 1)

        return [
            {"role": m["role"], "content": m["content"]}
            for m in cursor
        ]
    except PyMongoError as e:
        raise RuntimeError(f"Failed to fetch conversation: {e}") from e
    

def create_user(email: str, password_hash: str) -> str:
    try:
        db = get_db()
        doc = user_doc(email, password_hash)
        result = db[USERS].insert_one(doc)
        return str(result.inserted_id)
    except PyMongoError as e:
        raise RuntimeError(f"Failed to create user: {e}") from e

def find_user_by_email(email: str) -> list[dict] | None:
    try:
        db = get_db()
        return db[USERS].find_one({"email": email})
    except PyMongoError as e:
        raise RuntimeError(f"Failed to find user: {e}") from e


def get_all_conversations(user_id: str) -> list[dict]:
    try:
        db = get_db()
        cursor = db[CONVERSATIONS].find({"user_id": user_id}).sort("updated_at", -1)
        return [
            {
                "id": str(c["_id"]),
                "created_at": c.get("created_at", ""),
                "updated_at": c.get("updated_at", ""),
            }
            for c in cursor
        ]
    except PyMongoError as e:
        raise RuntimeError(f"Failed to fetch conversations: {e}") from e


def get_conversation_messages(conversation_id: str) -> list[dict]:
    try:
        conv_oid = ObjectId(conversation_id)
    except (InvalidId, TypeError) as e:
        raise ValueError(f"Invalid conversation_id: {conversation_id}") from e

    try:
        db = get_db()
        cursor = db[MESSAGES].find({"conversation_id": conv_oid}).sort("created_at", 1)
        return [
            {"role": m["role"], "content": m["content"]}
            for m in cursor
        ]
    except PyMongoError as e:
        raise RuntimeError(f"Failed to fetch messages: {e}") from e
    
def delete_conversation(conversation_id: str) -> bool:
    try:
        conv_oid = ObjectId(conversation_id)
    except (InvalidId, TypeError) as e:
        raise ValueError(f"Invalid conversation_id: {conversation_id}") from e

    try:
        db = get_db()
        result = db[CONVERSATIONS].delete_one({"_id": conv_oid})
        db[MESSAGES].delete_many({"conversation_id": conv_oid})
        return result.deleted_count > 0
    except PyMongoError as e:
        raise RuntimeError(f"Failed to delete conversation: {e}") from e