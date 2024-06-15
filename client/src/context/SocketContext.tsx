import { useState, createContext, useContext, useEffect } from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { ReactNode } from "react"
import { useAppSelector } from "@/hooks"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({ socket: null })

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { loading, isAuthenticated, user } = useAppSelector(
    (state) => state.user,
  )

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
