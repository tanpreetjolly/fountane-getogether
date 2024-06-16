import { Server as SocketIOServer, Socket } from "socket.io"
import { Channel, ChatMessage } from "../models"
import { generateChatId } from "../utils/utilFunctions"
import { saveImages } from "../utils/imageHandlers/cloudinary"

export default (io: SocketIOServer | null, socket: Socket) => {
    if (!io) return
    console.log(`${socket.id} connected`)
    const userId = socket.user.userId
    const vendorProfileId = socket.user.vendorProfile
    socket.join(userId.toString())
    if (vendorProfileId) socket.join(vendorProfileId.toString())

    const sendChatMessage = async (
        data: {
            message: string
            receiverId: string
            images: Buffer[]
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
                image: data.images ? await saveImages(data.images) : [],
            })
            io.to(data.receiverId.toString()).emit("chat message", newMessage)
            cb(newMessage)
        } catch (error) {
            console.log(error)
            cb(error)
        }
    }
    const sendChannelMessage = async (
        data: {
            message: string
            channelId: string
            images: Buffer[]
        },
        cb: any,
    ) => {
        try {
            const channel = await Channel.findById(data.channelId).select(
                "allowedUsers",
            )
            if (!channel) return cb("Channel not found")
            if (
                !channel.allowedUsers.some(
                    (id) =>
                        id.toString() === userId.toString() ||
                        id.toString() === vendorProfileId?.toString(),
                )
            )
                return cb("You are not allowed to send message to this channel")
            const newMessage = await ChatMessage.create({
                senderId: userId,
                chatId: data.channelId,
                message: data.message,
                image: data.images ? await saveImages(data.images) : [],
            })
            io.to(
                channel.allowedUsers
                    .map((id) => id.toString())
                    .filter(
                        (id) =>
                            id !== userId.toString() &&
                            id !== vendorProfileId?.toString(),
                    ),
            ).emit("channel message", newMessage)
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
    socket.on("send:channel:message", sendChannelMessage)
    socket.on("disconnect", disconnect)
}
