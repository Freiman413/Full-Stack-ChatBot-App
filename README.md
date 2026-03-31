# Ollama Chatbot

An AI-powered chatbot application for real-time conversations. Students interact through a chat interface to ask questions and receive intelligent responses. The system uses **Ollama** for local LLM inference with a **React** frontend and **FastAPI** backend.

---

## Tech Stack

**Backend:** Python 3.12, FastAPI, Uvicorn

**Database:** MongoDB via PyMongo

**Caching:** Redis for conversation context caching

**AI:** Ollama with TinyLlama model (local inference)

**Auth:** JWT via PyJWT, stored in localStorage, passwords hashed with bcrypt

**Frontend:** React 18, Vite, React Router, Formik + Yup, Axios

**Containerization:** Docker and Docker Compose

---

## Project Structure

```
project/
├── main.py
├── requirements.txt
├── dockerfile
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── core/
│   ├── auth.py
│   ├── config.py
│   ├── db.py
│   └── redis_client.py
├── model/
│   └── mongo_model.py
├── repository/
│   └── mongo_repo.py
├── router/
│   ├── auth.py
│   ├── chat.py
│   └── health.py
├── service/
│   ├── auth_service.py
│   └── chat.py
├── vallidation/
│   └── text_vall.py
└── chatbot-frontend/
    ├── Dockerfile
    └── src/
        ├── api/
        │   └── axiosConfig.js
        ├── context/
        │   └── AuthContext.jsx
        ├── features/
        │   ├── auth/
        │   │   ├── components/
        │   │   │   ├── LoginForm/
        │   │   │   │   ├── LoginForm.jsx
        │   │   │   │   └── LoginForm.css
        │   │   │   └── RegisterForm/
        │   │   │       ├── RegisterForm.jsx
        │   │   │       └── RegisterForm.css
        │   │   ├── hooks/
        │   │   │   └── useAuth.js
        │   │   └── services/
        │   │       └── authService.js
        │   └── chat/
        │       ├── components/
        │       │   ├── ChatInput/
        │       │   │   ├── ChatInput.jsx
        │       │   │   └── ChatInput.css
        │       │   └── ChatWindow/
        │       │       ├── ChatWindow.jsx
        │       │       └── ChatWindow.css
        │       ├── hooks/
        │       │   └── useMessages.js
        │       └── services/
        │           └── chatService.js
        ├── pages/
        │   ├── ChatPage.jsx
        │   ├── ChatPage.css
        │   ├── LoginPage.jsx
        │   └── RegisterPage.jsx
        ├── components/
        │   ├── Button/
        │   │   ├── Button.jsx
        │   │   └── Button.css
        │   └── InputField/
        │       ├── InputField.jsx
        │       └── InputField.css
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        └── index.css
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/health` | Health check | No |
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login and receive JWT | No |
| `POST` | `/chat/` | Send message, get AI response | Yes |
| `GET` | `/chat/conversations` | List user conversations | Yes |
| `GET` | `/chat/{id}/messages` | Get conversation messages | Yes |
| `DELETE` | `/chat/{id}` | Delete a conversation | Yes |

---

## Features

- **User Authentication** — Register and login with email and password. JWT tokens with 30-minute expiry.
- **Real-time Chat** — Send messages and receive AI-powered responses from Ollama.
- **Conversation History** — Sidebar displays all previous conversations. Click to reload any conversation.
- **Delete Conversations** — Remove conversations with confirmation dialog.
- **Privacy** — Each user sees only their own conversations, filtered by user ID.
- **Optimistic UI** — User messages appear instantly before server responds.
- **Loading States** — Visual feedback while waiting for AI response.
- **Error Handling** — Graceful error messages for failed requests.
- **Form Validation** — Client-side validation with Yup before sending to backend.
- **Token Interceptor** — Axios automatically attaches JWT to every authenticated request.

---

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Ollama](https://ollama.com/download) installed locally

---

## Setup and Run

### 1. Clone the repository

```bash
git clone https://github.com/Freiman413/Full-Stack-ChatBot-App.git
cd Full-Stack-ChatBot-App
```

### 2. Configure environment

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb://mongodb:27017
REDIS_URL=redis://redis:6379
SECRET_KEY=your-secret-key-here
OLLAMA_MODEL=tinyllama
OLLAMA_BASE_URL=http://host.docker.internal:11434
```

### 3. Start Ollama

In a separate terminal:

```bash
ollama serve
```

Pull the model if running for the first time:

```bash
ollama pull tinyllama
```

### 4. Start the application

```bash
docker-compose up --build
```

This starts four containers:

- **MongoDB** on port 27017
- **Redis** on port 6379
- **FastAPI backend** on port 8000
- **React frontend** on port 5173

### 5. Open the application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. **Register** a new account with email and password (minimum 8 characters)
2. **Login** with your credentials
3. **Start a new conversation** or open a previous one from the sidebar
4. **Type a message** and receive a response from the AI model
5. **Delete conversations** from the sidebar with the X button
6. **Logout** when done

---

## Architecture

The frontend communicates with the backend through Axios with an automatic token interceptor. Every authenticated request includes the JWT token in the Authorization header. The backend validates the token, identifies the user, and processes the request. Conversations are scoped per user for privacy.

**Message flow:**

1. User types message in `ChatInput`
2. `useMessages` hook adds it to the UI immediately (optimistic update)
3. `chatService` sends it via Axios to the FastAPI backend
4. Backend checks Redis cache for conversation context
5. Backend sends the full prompt to Ollama
6. Ollama returns a response
7. Backend saves both messages in MongoDB
8. Backend caches the updated context in Redis (5 min TTL)
9. Response is returned to the frontend and displayed

---

## Stopping the Application

```bash
docker-compose down
```

To also remove stored data (MongoDB volumes):

```bash
docker-compose down -v
```