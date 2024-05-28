import { Schema, model } from "mongoose"
import { ISubEvent } from "../types/models"
import Channel from "./channel"
import { PERMISSIONS, CHANNEL_TYPES, ROLES } from "../values"

const SubEventSchema = new Schema<ISubEvent>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
        },
        startDate: {
            type: Date,
            required: [true, "Please Provide Start Date."],
        },
        endDate: {
            type: Date,
            required: [true, "Please Provide End Date."],
        },
        venue: {
            type: String,
            required: [true, "Please Provide Venue."],
        },
        channels: {
            type: [Schema.Types.ObjectId],
            ref: "Channel",
        },
    },
    { timestamps: true },
)

SubEventSchema.pre("save", function (next) {
    const newSubEventChannels = [
        {
            name: "Announcement",
            allowedUsers: [],
            allowedRoles: [ROLES.HOST, ROLES.VENDOR, ROLES.GUEST],
            type: CHANNEL_TYPES.MAIN,
        },
        {
            name: "Vendors Only",
            allowedUsers: [],
            allowedRoles: [ROLES.VENDOR, ROLES.HOST],
            type: CHANNEL_TYPES.MAIN,
        },
        {
            name: "Guests Only",
            allowedUsers: [],
            allowedRoles: [ROLES.GUEST, ROLES.HOST],
            type: CHANNEL_TYPES.MAIN,
        },
    ]
    if (this.isNew) {
        Channel.insertMany(newSubEventChannels)
            .then((createdChannels) => {
                createdChannels.forEach((channel) => {
                    this.channels.push(channel._id)
                })
                next()
            })
            .catch(next)
    } else {
        next()
    }
})

const SubEvent = model<ISubEvent>("SubEvent", SubEventSchema)
export default SubEvent
