import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"
import { CHANNEL_TYPES } from "../values"

const ChannelSchema = new Schema<IChannel>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Channel Name."],
        },
        allowedUsers: [
            {
                type: Schema.Types.ObjectId,
            },
        ],
        type: {
            type: String,
            enum: Array.from(Object.values(CHANNEL_TYPES)),
            default: CHANNEL_TYPES.OTHER,
        },
    },
    { timestamps: true },
)

const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
