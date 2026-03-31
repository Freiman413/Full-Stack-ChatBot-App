import requests
from repository.mongo_repo import start_new_conversation, save_message, get_conversation
from core.config import settings
from core.redis_client import redis_client
import json


def create_conversation(user_id: str):
    return start_new_conversation(user_id)


def chat(message: str, conversation_id: str):
    cache_key = f"chat_context:{conversation_id}"
    cache = redis_client.get(cache_key)
    if cache:
        history = json.loads(cache)
    else:
        history = get_conversation(conversation_id)
        if history is None:
            raise ValueError(f"Conversation {conversation_id} not found")

    save_message("user", message, conversation_id)

    prompt = build_prompt(message, history)
    assistant_reply = ask_ollama(prompt)

    save_message("assistant", assistant_reply, conversation_id)
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant","content": assistant_reply})
    redis_client.set(cache_key, json.dumps(history), ex=300)
    return assistant_reply


def build_prompt(message: str, history: list[dict]):
    prompt = [{"role": m["role"], "content": m["content"]} for m in history]
    prompt.append({"role": "user", "content": message})
    return prompt


def ask_ollama(prompt: list[dict]):
    response = requests.post(
        f"{settings.OLLAMA_BASE_URL}/api/chat",
        json={
            "model": settings.OLLAMA_MODEL,
            "messages": prompt,
            "stream": False
        }
    )
    data = response.json()
    print(f"DEBUG DATA: {data}", flush=True)
    return data["message"]["content"]