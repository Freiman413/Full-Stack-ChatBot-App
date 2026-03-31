from pydantic import BaseModel, Field, EmailStr


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    conversation_id: str
    response: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str =Field(...,min_length=8)


class RegisterResponse(BaseModel):
    message: str
    user_id: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class ConversationItem(BaseModel):
    id: str
    created_at: str
    updated_at: str

class ConversationListResponse(BaseModel):
    conversations: list[ConversationItem]

class MessagesResponse(BaseModel):
    messages: list[dict]