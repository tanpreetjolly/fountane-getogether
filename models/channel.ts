import { Schema, model } from "mongoose"
import { IChannel, IChatMessage } from "../types/models"

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

const ChannelSchema = new Schema<IChannel>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Channel Name."],
        },
        allowedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true },
)

const Channel = model<IChannel>("Event", ChannelSchema)
export default Channel
