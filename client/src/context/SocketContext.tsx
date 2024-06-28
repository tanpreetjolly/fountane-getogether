import { useState, createContext, useContext, useEffect } from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useParams } from "react-router-dom"
import { ChatMessage, OtherUserType } from "@/definitions"
import { getOtherUserDetails } from "@/api"
import { setChatAsUnread } from "@/features/userSlice"
import lodash from "lodash"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
})

const fetchOtherUser = async (id: string) => {
  try {
    const response = await getOtherUserDetails(id)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return null
  }
}
const memoizedFetchData = lodash.memoize(fetchOtherUser)

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  const { loading, isAuthenticated, user } = useAppSelector(
    (state) => state.user,
  )

  const { chatId, channelId } = useParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (loading || !isAuthenticated || !user?.socketToken)
      return () => {
        socket?.disconnect()
      }
    const socketConnection = io({
      autoConnect: false,
      auth: {
        token: user.socketToken,
      },
    })
    setSocket(() => socketConnection)

    const onConnect = () => {
      // if (import.meta.env.DEV)
      console.log("Socket connected" + socketConnection.id)
    }
    const onReconnect = () => {
      // if (import.meta.env.DEV)
      toast.success(`Connected`, {
        id: "socket-connection",
      })
      console.log("Reconnected")
    }
    const onConnect_error = (err: Error) => {
      console.log(`connect_error due to ${err.message}`)
    }
    const onDisconnect = (reason: Socket.DisconnectReason) => {
      console.log(`socket disconnected due to ${reason}`)
    }

    socketConnection.on("connect", onConnect)
    socketConnection.on("connect_error", onConnect_error)
    socketConnection.on("disconnect", onDisconnect)
    socketConnection.io.on("reconnect", onReconnect)

    socketConnection.connect()

    return () => {
      socketConnection.disconnect()
    }
  }, [loading, isAuthenticated, user, user?.socketToken])

  useEffect(() => {
    if (!socket) return () => {}
    const onNewChatMessage = (data: ChatMessage) => {
      console.log(data)
      if (data.senderId === chatId) return
      dispatch(setChatAsUnread(data.chatId))
      memoizedFetchData(data.senderId).then((user: OtherUserType) => {
        console.log(user)
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.profileImage}
                      alt={user.name}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{data.message}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          {
            id: `new-message-${data.senderId}`,
          },
        )
        // toast.success(`New message: ${data.message}`, {
        //   id: `new-message-${data.senderId}`,
        // })
      })
    }
    const onNewChannelMessage = (data: ChatMessage) => {
      console.log(data)
      if (data.chatId === channelId) return
      dispatch(setChatAsUnread(data.chatId))
      toast.success(`New message: ${data.message}`, {
        id: `new-message-${data.senderId}`,
      })
    }

    socket.on("chat message", onNewChatMessage)
    socket.on("channel message", onNewChannelMessage)
    return () => {
      socket.off("chat message", onNewChatMessage)
      socket.off("channel message", onNewChannelMessage)
    }
  }, [chatId, channelId, socket])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
const useSocketContext = () => {
  return useContext(SocketContext)
}

export { SocketContext, SocketContextProvider, useSocketContext }
