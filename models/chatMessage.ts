import { Schema, model } from "mongoose"
import { IChatMessage } from "../types/models"

const chatMessageSchema = new Schema<IChatMessage>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide User Id."],
        },
        chatId: {
            type: String,
            required: [true, "Please Provide Chat Id."],
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
        image: { type: [String], default: [] },
    },
    { timestamps: true },
)

chatMessageSchema.index({ chatId: 1, createdAt: 1 })

const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema)
export default ChatMessage
