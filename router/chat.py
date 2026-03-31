from fastapi import APIRouter, Depends
from vallidation.text_vall import ChatRequest, ChatResponse, ConversationListResponse, MessagesResponse
from service.chat import create_conversation, chat
from repository.mongo_repo import get_all_conversations, get_conversation_messages, delete_conversation
from core.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, user_id: str = Depends(get_current_user)):
    conversation_id = request.conversation_id
    if conversation_id is None:
        conversation_id = create_conversation(user_id)

    reply = chat(request.message, conversation_id)

    return ChatResponse(conversation_id=conversation_id, response=reply)


@router.get("/conversations", response_model=ConversationListResponse)
def list_conversations(user_id: str = Depends(get_current_user)):
    conversations = get_all_conversations(user_id)
    return ConversationListResponse(conversations=conversations)


@router.get("/{conversation_id}/messages", response_model=MessagesResponse)
def get_messages(conversation_id: str, user_id: str = Depends(get_current_user)):
    messages = get_conversation_messages(conversation_id)
    return MessagesResponse(messages=messages)


@router.delete("/{conversation_id}")
def delete_conversation_endpoint(conversation_id: str, user_id: str = Depends(get_current_user)):
    deleted = delete_conversation(conversation_id)
    if not deleted:
        return {"detail": "Conversation not found"}
    return {"detail": "Conversation deleted"}