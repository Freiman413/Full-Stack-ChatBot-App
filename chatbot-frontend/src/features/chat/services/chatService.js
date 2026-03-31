import api from "../../../api/AxiosConfig"

async function sendMessage(message, conversationId) {
  const body = { message }
  if (conversationId) {
    body.conversation_id = conversationId
  }
  const response = await api.post("/chat/", body)
  return response.data
}

async function getConversations() {
  const response = await api.get("/chat/conversations")
  return response.data
}

async function getMessages(conversationId) {
  const response = await api.get("/chat/" + conversationId + "/messages")
  return response.data
}

async function deleteConversation(conversationId) {
  const response = await api.delete("/chat/" + conversationId)
  return response.data
}

export { sendMessage, getConversations, getMessages, deleteConversation }