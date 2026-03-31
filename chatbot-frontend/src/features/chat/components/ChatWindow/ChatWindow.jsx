import { useEffect, useRef } from "react"
import "./ChatWindow.css"

function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <div className="chat-empty-text">Send a message to start chatting</div>
        </div>
      )}
      {messages.map((msg, index) => (
        <div key={index} className={"message " + msg.role}>
          <div className="message-label">
            {msg.role === "user" ? "You" : "Ollama"}
          </div>
          <div className="bubble">{msg.content}</div>
        </div>
      ))}
      {isLoading && (
        <div className="message assistant">
          <div className="message-label">Ollama</div>
          <div className="bubble loading">Thinking...</div>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  )
}

export default ChatWindow