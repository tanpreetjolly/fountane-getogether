import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"
import Roles from "../roles"

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
        allowedRoles: {
            type: [String],
            enum: Array.from(Object.values(Roles)),
            default: [Roles.HOST],
        },
        type: {
            type: String,
            enum: ["main", "other"],
            default: "other",
        },
    },
    { timestamps: true },
)

const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
