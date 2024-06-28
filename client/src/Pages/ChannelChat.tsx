import { Input, Modal, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import MessageComponent from "../components/MessageComponent"
import { Link, SendHorizontal, Info, ArrowLeft } from "lucide-react"
import Loader from "../components/Loader"
import { getChannelMessages } from "../api"
import { useNavigate, useParams } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { ChatMessage, ChannelDetails } from "@/definitions"
import { useSocketContext } from "@/context/SocketContext"
import { useEventContext } from "@/context/EventContext"
import ButtonSecondary from "@/components/ButtonSecondary"
import { Close } from "@mui/icons-material"

const ChannelChat = () => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(
    null,
  )
  const [newMessage, setNewMessage] = useState("")
  const [imagesFiles, setImagesFiles] = useState<File[]>([])
  const [sendingMessage, setSendingMessage] = useState(false)

  const { channelId } = useParams()
  const { user } = useAppSelector((state) => state.user)
  const userId = user?.userId
  const navigate = useNavigate()
  const { socket } = useSocketContext()

  const { event } = useEventContext()

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setSendingMessage(true)
      socket?.emit(
        "send:channel:message",
        {
          message: newMessage,
          channelId: channelId,
          images: imagesFiles,
        },
        (res: ChatMessage) => {
          setMessages((prev) => [...prev, res])
          setSendingMessage(false)
        },
      )
      setNewMessage("")
      setImagesFiles([])
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
  if (event === null) return <div>Event not found</div>

  return (
    <div className="px-4 bg-white flex-col flex justify-between h-[90vh] py-4 relative mx-auto">
      <div className="absolute top-0 z-10 bg-white border-b py-3 w-full lg:w-4/5 left-1/2 -translate-x-[50%] flex items-center gap-2 px-3">
        <ArrowLeft
          size={18}
          onClick={() => navigate(-1)}
          className="hidden md:inline cursor-pointer"
        />
        <div className="flex justify-between w-full">
          <div>
            <p className="text-gray-800">{channelDetails.name}</p>
          </div>
        </div>
      </div>
      <div
        id="chatBox"
        className="mb-4 overflow-y-auto max-h-[80vh] flex flex-col gap-3 py-20 lg:w-4/5 mx-auto"
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
            images={msg.image}
          />
        ))}
        {sendingMessage && (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
      {channelDetails.type === "announcement" && !event.isHosted ? (
        <div>
          <p className="text-center text-red-500">
            Only host can send messages to this channel
          </p>
        </div>
      ) : (
        <InputBar
          {...{
            channelDetails,
            newMessage,
            setNewMessage,
            imagesFiles,
            setImagesFiles,
            handleSendMessage,
          }}
        />
      )}
    </div>
  )
}

const ChannelInfoModal = ({
  open,
  handleClose,
  channelDetails,
}: {
  open: boolean
  handleClose: () => void
  channelDetails: ChannelDetails
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="channel-info-modal"
      aria-describedby="channel-info-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="channel-info-modal" variant="h6" component="h2">
          Channel Information
        </Typography>
        <Typography id="channel-info-description" sx={{ mt: 1 }}>
          Name: {channelDetails.name}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Allowed Users:{" "}
          {channelDetails.allowedUsers.map((user) => user.name).join(", ")}
        </Typography>
        <div className="w-fit mt-4 ml-auto">
          <ButtonSecondary
            onClick={handleClose}
            text="Close"
            icon={<Close />}
          />
        </div>
      </Box>
    </Modal>
  )
}

const InputBar = ({
  channelDetails,
  newMessage,
  setNewMessage,
  imagesFiles,
  setImagesFiles,
  handleSendMessage,
}: {
  channelDetails: ChannelDetails
  newMessage: string
  setNewMessage: (value: string) => void
  imagesFiles: File[]
  setImagesFiles: (value: File[]) => void
  handleSendMessage: () => void
}) => {
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <div className="md:px-20 flex justify-center gap-2 items-center fixed w-full md:w-4/5 backdrop-blur-md py-4 px-4 left-1/2 translate-x-[-50%] bottom-14 md:bottom-4">
      <button
        className="p-2.5 border border-zinc-600 text-zinc-600 rounded-full"
        onClick={handleOpenModal}
      >
        <Info size={20} />
      </button>
      <ChannelInfoModal
        open={openModal}
        handleClose={handleCloseModal}
        channelDetails={channelDetails}
      />
      <label
        htmlFor="file-upload"
        className="p-2.5 border border-zinc-600 text-zinc-600 rounded-full relative hover:bg-zinc-600 hover:text-white cursor-pointer"
      >
        {imagesFiles.length > 0 && (
          <div className="flex gap-2 absolute bottom-12 right-0">
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
        onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
      />
      <button
        onClick={handleSendMessage}
        className="py-2.5 px-3 bg-zinc-600 text-white rounded-full"
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  )
}

export default ChannelChat
