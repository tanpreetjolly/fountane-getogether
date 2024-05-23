import { Input } from "@mui/material"
import MessageComponent from "../components/MessageComponent"
import { useState } from "react"
import { MdMarkEmailRead } from "react-icons/md";
// type Props = {}

const randomChatData = [
  { id: 1, message: "Hey there!", name: "Alice", date: "10:30" },
  { id: 2, message: "Hello!", name: "Bob", date: "10:32" },
  { id: 3, message: "How are you?", name: "Alice", date: "10:34" },
  { id: 4, message: "I'm good, thanks!", name: "You", date: "10:35" },
  { id: 6, message: "I'm doing well too.", name: "Alice", date: "10:37" },
]

const VendorChat = () => {
  const userId = 4

  const [messages, setMessages] = useState(randomChatData)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageData = {
        id: userId,
        message: newMessage,
        name: "You",
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages([...messages, newMessageData])
      setNewMessage("")
    }
  }
  return (
    <div className="px-4 flex  flex-col justify-between min-h-[90vh]">
      <div className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3">
        <div className="text-lg bg-dark text-center py-1.5  justify-center  items-center gap-2 flex text-white  rounded-lg">Invited <span><MdMarkEmailRead/></span></div>
        {messages.map((msg, index) => (
          <MessageComponent
            key={index}
            message={msg.message}
            name={msg.name}
            date={msg.date}
            isUserMessage={msg.id === userId}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default VendorChat
