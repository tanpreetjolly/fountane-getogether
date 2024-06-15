import { Input } from "@mui/material"
import { useEffect, useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { Link, SendHorizontal } from "lucide-react"
import Loader from "../components/Loader"
import { getChatMessages } from "../api"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { ChatMessage, ChannelDetails } from "@/definitions"

const ChannelChat = () => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatDeatils, setChatDetails] = useState<ChannelDetails>({})
  const [newMessage, setNewMessage] = useState("")

  const { chatId } = useParams()
  const { user } = useAppSelector((state) => state.user)
  const userId = user?.userId

  const handleSendMessage = () => {
    // if (newMessage.trim() !== "") {
    //   const newMessageData = {
    //     id: userId,
    //     message: newMessage,
    //     name: "You",
    //     date: new Date().toLocaleTimeString([], {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     }),
    //   }
    //   setMessages([...messages, newMessageData])
    //   setNewMessage("")
    // }
  }

  useEffect(() => {
    if (!chatId) return
    // const chatContainer = document.querySelector(".chat-container")
    // chatContainer?.scrollTo(0, chatContainer.scrollHeight)
    setLoading(true)
    getChatMessages(chatId)
      .then((res) => {
        console.log(res.data.messages)
        setMessages(res.data.messages)
      })
      .finally(() => setLoading(false))
  }, [chatId])

  if (loading) return <Loader />

  return (
    <div className="px-4 flex-col flex justify-between h-[87vh] py-4 relative lg:w-4/5 mx-auto">
      <div className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 pb-20 ">
        {messages.map((msg, index) => (
          <MessageComponent
            key={index}
            message={msg.message}
            // name={msg.name}
            name="hj"
            date={msg.createdAt}
            isUserMessage={msg.senderId === userId}
            // imgSrc={msg.imgSrc}
          />
        ))}
      </div>
      <div className="md:px-20 flex justify-center gap-2 items-center fixed w-4/5 backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
        <button className="p-2.5 border border-zinc-600 text-zinc-600 rounded-full">
          <Link size={20} />
        </button>
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
