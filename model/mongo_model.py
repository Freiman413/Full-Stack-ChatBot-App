from typing import Any
from datetime import datetime, timezone
from bson import ObjectId


def conversation_doc(user_id: str):
    now = datetime.now(timezone.utc).isoformat()
    return {
        "user_id" : user_id,
        "created_at": now,
        "updated_at": now,
    }


def message_doc(role: str, content: str, conv_id: ObjectId):
    return {
        "conversation_id": conv_id,
        "role": role,
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def user_doc(email: str, password_hash: str):
    return {
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }