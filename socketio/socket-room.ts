import { Server as SocketIOServer, Socket } from "socket.io"
import { Channel, ChatMessage } from "../models"
import { IChatMessage } from "../types/models"
import { generateChatId } from "../utils/utilFunctions"

export default (io: SocketIOServer | null, socket: Socket) => {
    if (!io) return
    console.log(`${socket.id} connected`)
    const userId = socket.user.userId
    socket.join(userId.toString())

    const sendChatMessage = async (
        data: {
            message: string
            receiverId: string
            image: string
        },
        cb: any,
    ) => {
        try {
            const newMessage = await ChatMessage.create({
                senderId: userId,
                chatId: generateChatId(
                    userId.toString(),
                    data.receiverId.toString(),
                ),
                message: data.message,
                image: data.image,
            })
            io.to(data.receiverId.toString()).emit("chat message", newMessage)
            cb(newMessage)
        } catch (error) {
            console.log(error)
            cb(error)
        }
    }

    const disconnect = (data: any, cb: any) => {
        try {
            console.log(`${socket.id} disconnected`)
            socket.removeAllListeners()
        } catch (error) {
            console.log(error)
        }
    }

    socket.on("send:chat:message", sendChatMessage)
    socket.on("disconnect", disconnect)
}
