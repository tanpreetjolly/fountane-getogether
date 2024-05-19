import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"

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

const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
