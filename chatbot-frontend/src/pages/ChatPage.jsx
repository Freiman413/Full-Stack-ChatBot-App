import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ChatWindow from "../features/chat/components/ChatWindow/ChatWindow"
import ChatInput from "../features/chat/components/ChatInput/ChatInput"
import useMessages from "../features/chat/hooks/useMessages"
import "./ChatPage.css"

function ChatPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useContext(AuthContext)
  const {
    messages,
    isLoading,
    error,
    send,
    resetChat,
    conversations,
    conversationId,
    loadConversations,
    loadConversation,
    removeConversation,
  } = useMessages()

  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations()
    }
  }, [isAuthenticated])

  function handleDelete(convId) {
    setDeleteTarget(convId)
  }

  function confirmDelete() {
    if (deleteTarget) {
      removeConversation(deleteTarget)
      setDeleteTarget(null)
    }
  }

  function cancelDelete() {
    setDeleteTarget(null)
  }

  if (authLoading) {
    return <div className="page-loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="chat-page">
      {deleteTarget && (
        <div className="delete-overlay">
          <div className="delete-modal">
            <p>Delete this conversation?</p>
            <div className="delete-actions">
              <button className="delete-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="delete-confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Conversations</h3>
          <button className="new-chat-btn" onClick={resetChat}>+ New</button>
        </div>
        <div className="sidebar-list">
          {conversations.length === 0 && (
            <div className="sidebar-empty">No conversations yet</div>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={"sidebar-item" + (conv.id === conversationId ? " active" : "")}
            >
              <div
                className="sidebar-item-content"
                onClick={() => loadConversation(conv.id)}
              >
                <div className="sidebar-item-title">
                  {conv.updated_at.slice(0, 10)}
                </div>
                <div className="sidebar-item-id">
                  {conv.id.slice(0, 8)}...
                </div>
              </div>
              <button
                className="sidebar-item-delete"
                onClick={() => handleDelete(conv.id)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <h2>Ollama Chat</h2>
        </div>
        {error && <div className="chat-error">{error}</div>}
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSend={send} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default ChatPage