import jwt
from passlib.context import CryptContext
from repository.mongo_repo import create_user, find_user_by_email
from datetime import datetime, timezone, timedelta
from core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated= "auto")

def register(email: str, password: str):
    existing =find_user_by_email(email)
    if existing:
        raise ValueError("Email already registered")
    password_hash = pwd_context.hash(password)
    user_id = create_user(email, password_hash)
    return user_id


def create_access_token(user_id: str):
    expire = datetime.now(timezone.utc)+timedelta(minutes=30)
    payload = {
        "user_id": user_id,
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)



def login(email: str, password: str):
    user = find_user_by_email(email)
    if not user:
        raise ValueError("Invalid email or password")
    if not pwd_context.verify(password, user["password_hash"]):
        raise ValueError("Invalid email or password")
    
    token = create_access_token(str(user["_id"]))
    return token