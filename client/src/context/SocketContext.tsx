import { useState, createContext, useContext, useEffect } from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { ReactNode } from "react"
import { useAppSelector } from "../hooks"

const SocketContext = createContext<any>(null)

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { loading, isAuthenticated, user } = useAppSelector(
    (state) => state.user,
  )

  useEffect(() => {
    if (loading && !isAuthenticated)
      return () => {
        socket?.disconnect()
      }
    const socketConnection = io({
      autoConnect: false,
      auth: {
        token: user?.socketToken,
      },
    })
    setSocket(() => socketConnection)
    socketConnection.connect()
    socketConnection.on("connect", () => {
      console.log("socket connected")
    })
    socketConnection.on("connect_error", (err) => {
      if (err.message === "xhr poll error") {
        socketConnection.disconnect()
      }
      toast.error(`Socket connection error: ${err.message}`)
      console.log(`connect_error due to ${err.message}`)
    })
    socketConnection.on("disconnect", () => {
      console.log("socket disconnected")
    })
    return () => {
      socketConnection.close()
      socketConnection.disconnect()
    }
  }, [loading, isAuthenticated])

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
