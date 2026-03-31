import { useState } from "react"
import "./ChatInput.css"

function ChatInput({ onSend, isLoading}) {
    const [text, setText] = useState("")

    function handelSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        if (!trimmed || isLoading) {
            return
        }
        onSend(trimmed)
        setText("")
    }

    return (
        <form className="chat-input" onSubmit={handelSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
            />
            <button type="submit" disabled={!text.trim() || isLoading}>
                {isLoading ? "Sending..." : "Send"}
            </button>
        </form>
    )
}

export default ChatInput