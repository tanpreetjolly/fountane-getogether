import { Input } from "@mui/material"
import { useEffect, useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { Link, SendHorizontal } from "lucide-react"
import Loader from "../components/Loader"
import { getChatMessages } from "../api"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { ChatMessage, OtherUserType } from "@/definitions"
import { useSocketContext } from "@/context/SocketContext"

const ChatPage = () => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatDetails, setChatDetails] = useState<OtherUserType | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const { chatId } = useParams()
  const { user } = useAppSelector((state) => state.user)
  const userId = user?.userId

  const { socket } = useSocketContext()

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket?.emit(
        "send:chat:message",
        {
          message: newMessage,
          receiverId: chatId,
        },
        (res: ChatMessage) => {
          // console.log(res)
          setMessages((prev) => [...prev, res])
          setNewMessage("")
        },
      )
    }
  }

  useEffect(() => {
    if (!chatId) return

    //scroll to bottom
    const chatBox = document.getElementById("chatBox")
    chatBox?.scrollTo(0, chatBox.scrollHeight)

    setLoading(true)
    getChatMessages(chatId)
      .then(
        (res: {
          data: {
            messages: ChatMessage[]
            otherUser: OtherUserType
          }
        }) => {
          console.log(res.data)
          setMessages(res.data.messages)
          setChatDetails(res.data.otherUser)
        },
      )
      .finally(() => setLoading(false))
  }, [chatId])

  if (loading) return <Loader />
  if (user === null) return <div>User not found</div>
  if (chatDetails === null) return <div>Chat not found</div>

  return (
    <div className="px-4 flex-col flex justify-between h-[87vh] py-4 relative lg:w-4/5 mx-auto">
      <div
        id="chatBox"
        className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 pb-20 "
      >
        {messages.map((msg) => (
          <MessageComponent
            key={msg._id}
            message={msg.message}
            profileImage={
              msg.senderId === userId
                ? user.profileImage
                : chatDetails.profileImage
            }
            name={msg.senderId === userId ? user.name : chatDetails.name}
            date={msg.createdAt}
            isUserMessage={msg.senderId === userId}
            imgSrc={msg.image}
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

export default ChatPage
