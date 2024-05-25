import { Schema, model } from "mongoose"
import { ISubEvent } from "../types/models"
import Roles from "../roles"
import Channel from "./channel"

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
            allowedRoles: Array.from(Object.values(Roles)),
            type: "main",
        },
        {
            name: "Vendors Only",
            allowedUsers: [],
            allowedRoles: [Roles.VENDOR, Roles.HOST],
            type: "main",
        },
        {
            name: "Guests Only",
            allowedUsers: [],
            allowedRoles: [Roles.GUEST, Roles.HOST],
            type: "main",
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
