import { Input } from "@mui/material"
import { useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { SendHorizontal } from "lucide-react"

const randomChatData = [
  { id: 1, message: "Hey there!", name: "Alice", date: "10:30" },
  { id: 2, message: "Hello!", name: "Bob", date: "10:32" },
  { id: 3, message: "How are you?", name: "Alice", date: "10:34" },
  { id: 4, message: "I'm good, thanks!", name: "You", date: "10:35" },
  { id: 6, message: "I'm doing well too.", name: "Alice", date: "10:37" },
]

const userId = 4

const ChannelChat = () => {
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
    <div className="px-4 flex-col flex justify-between h-[87vh] py-4 relative">
      <div className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 pb-20 ">
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
      <div className="flex items-center gap-2 absolute bottom-4 w-11/12">
        <Input
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        />
        <button
          onClick={handleSendMessage}
          className="py-2.5 px-3 bg-zinc-600 text-white rounded-full"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChannelChat
