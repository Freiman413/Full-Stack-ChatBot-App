import { useState } from "react"
import { sendMessage, getConversations, getMessages, deleteConversation } from "../services/chatService"

function useMessages() {
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send(text) {
    setError(null)
    setIsLoading(true)

    const userMessage = { role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])

    try {
      const data = await sendMessage(text, conversationId)

      if (!conversationId) {
        setConversationId(data.conversation_id)
        loadConversations()
      }

      const assistantMessage = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to send message"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadConversations() {
    try {
      const data = await getConversations()
      setConversations(data.conversations)
    } catch (err) {
      console.log("Failed to load conversations")
    }
  }

  async function loadConversation(convId) {
    setError(null)
    setIsLoading(true)
    try {
      const data = await getMessages(convId)
      setMessages(data.messages)
      setConversationId(convId)
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to load conversation"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function removeConversation(convId) {
    try {
      await deleteConversation(convId)
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (conversationId === convId) {
        setMessages([])
        setConversationId(null)
      }
    } catch (err) {
      setError("Failed to delete conversation")
    }
  }

  function resetChat() {
    setMessages([])
    setConversationId(null)
    setError(null)
  }

  return { messages, isLoading, error, send, resetChat, conversations, conversationId, loadConversations, loadConversation, removeConversation }
}

export default useMessages