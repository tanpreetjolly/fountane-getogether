import { Input } from "@mui/material"
import { useEffect, useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { Link, SendHorizontal, Info } from "lucide-react"
import Loader from "../components/Loader"
import { getChannelMessages } from "../api"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { ChatMessage, ChannelDetails } from "@/definitions"
import { useSocketContext } from "@/context/SocketContext"

const ChannelChat = () => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(
    null,
  )
  const [newMessage, setNewMessage] = useState("")

  const { channelId } = useParams()
  const { user } = useAppSelector((state) => state.user)
  const userId = user?.userId

  const { socket } = useSocketContext()

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket?.emit(
        "send:channel:message",
        {
          message: newMessage,
          channelId: channelId,
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
    if (!channelId || !socket) return () => {}

    const handleCurrentChannelMessage = (msg: ChatMessage) => {
      if (msg.chatId === channelId) setMessages((prev) => [...prev, msg])
    }

    setLoading(true)
    getChannelMessages(channelId)
      .then(
        (res: {
          data: {
            messages: ChatMessage[]
            channelDetails: ChannelDetails
          }
        }) => {
          console.log(res.data)
          setMessages(res.data.messages)
          setChannelDetails(res.data.channelDetails)

          socket.on("channel message", handleCurrentChannelMessage)
        },
      )
      .finally(() => {
        setLoading(false)
      })
    return () => {
      socket.off("channel message", handleCurrentChannelMessage)
    }
  }, [channelId, socket])

  useEffect(() => {
    const chatBox = document.getElementById("chatBox")
    chatBox?.scrollTo(0, chatBox.scrollHeight)
  }, [messages])

  if (loading) return <Loader />
  if (user === null) return <div>User not found</div>
  if (channelDetails === null) return <div>Channel not found</div>

  return (
    <div className="px-4 flex-col flex justify-between h-[87vh] py-4 relative lg:w-4/5 mx-auto">
      <div
        id="chatBox"
        className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 pb-2"
      >
        {messages.map((msg) => (
          <MessageComponent
            key={msg._id}
            message={msg.message}
            profileImage={
              channelDetails.allowedUsers.find(
                (user) => user._id === msg.senderId,
              )?.profileImage || ""
            }
            name={msg.senderId === userId ? user.name : channelDetails.name}
            date={msg.createdAt}
            isUserMessage={msg.senderId === userId}
            imgSrc={msg.image}
          />
        ))}
      </div>
      <div className="md:px-20 flex justify-center gap-2 items-center fixed w-4/5 backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
        <button
          className="p-2.5 border border-zinc-600 text-zinc-600 rounded-full"
          onClick={() => {
            //show a window message with chat details
            alert(
              "Name: " +
                channelDetails.name +
                "\nAllowed Users: " +
                channelDetails.allowedUsers.map((user) => user.name).join(", "),
            )
          }}
        >
          <Info size={20} />
        </button>
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
