import { Schema, model } from "mongoose"
import { IChatMessage } from "../types/models"

const chatMessageSchema = new Schema<IChatMessage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide User Id."],
        },
        channelId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide Channel Id."],
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
    },
    { timestamps: true },
)

chatMessageSchema.index({ channelId: 1, createdAt: 1 })

const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema)
export default ChatMessage
