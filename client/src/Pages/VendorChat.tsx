import { Input } from "@mui/material"
import { useEffect, useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { ArrowLeft, Link, SendHorizontal } from "lucide-react"
import Loader from "../components/Loader"
import { getChatMessages } from "../api"
import { useNavigate, useParams } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { ChatMessage, OtherUserType } from "@/definitions"
import { useSocketContext } from "@/context/SocketContext"

const VendorChat = () => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatDetails, setChatDetails] = useState<OtherUserType | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [imagesFiles, setImagesFiles] = useState<File[]>([])
  const navigate = useNavigate()
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
          images: imagesFiles,
        },
        (res: ChatMessage) => {
          // console.log(res)
          setMessages((prev) => [...prev, res])
        },
      )
      setNewMessage("")
      setImagesFiles([])
    }
  }

  useEffect(() => {
    if (!chatId || !socket) return () => {}

    const handleCurrentChatMessage = (msg: ChatMessage) => {
      if (msg.senderId === chatId) setMessages((prev) => [...prev, msg])
    }

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

          socket.on("chat message", handleCurrentChatMessage)
        },
      )
      .finally(() => {
        setLoading(false)
      })
    return () => {
      socket.off("chat message", handleCurrentChatMessage)
    }
  }, [chatId, socket])

  useEffect(() => {
    const chatBox = document.getElementById("chatBox")
    chatBox?.scrollTo(0, chatBox.scrollHeight)
  }, [messages])

  if (loading) return <Loader />
  if (user === null) return <div>User not found</div>
  if (chatDetails === null) return <div>User not found</div>

  return (
    <div className="px-4 bg-white  flex-col flex justify-between h-[90vh] py-4 relative  mx-auto">
      <div className="absolute top-0 z-10 bg-white border-b   py-3 w-full lg:w-4/5  left-1/2 -translate-x-[50%] flex items-center gap-2 px-3">
        <ArrowLeft
          size={18}
          onClick={() => navigate("/my-chats")}
          className="cursor-pointer hidden md:inline"
        />{" "}
        <img
          src={user.profileImage}
          alt={user.name}
          className="h-10 w-10 rounded-full"
        />
        <span>{chatDetails?.name}</span>
      </div>
      <div
        id="chatBox"
        className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 py-20 lg:w-4/5 w-full mx-auto"
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
            images={msg.image}
          />
        ))}
      </div>
      <div className="md:px-20 flex justify-center gap-2 items-center fixed w-full md:w-4/5 backdrop-blur-md  py-2 pb-4 px-4 left-1/2 translate-x-[-50%] bottom-14 md:bottom-4">
        {user.userId === chatId ? (
          <div className="text-red-500">You can't send message to yourself</div>
        ) : (
          <>
            <label
              htmlFor="file-upload"
              className="p-2.5 border border-zinc-600 text-zinc-600 rounded-full relative hover:bg-zinc-600 hover:text-white cursor-pointer"
            >
              {imagesFiles.length > 0 && (
                <div className="flex gap-2 absolute bottom-12 right-0 ">
                  {imagesFiles.map((file) => (
                    <img
                      key={file.name}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <Link size={20} />
            </label>
            <input
              id="file-upload"
              className="hidden"
              type="file"
              accept="image/jpeg, image/png, image/jpg, image/webp"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setImagesFiles(Array.from(e.target.files))
                }
              }}
              name="profileImage"
            />

            <Input
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
            />
            <button
              onClick={handleSendMessage}
              className="py-2.5 px-3 bg-zinc-600 text-white rounded-full"
            >
              <SendHorizontal size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VendorChat
