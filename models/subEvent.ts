import { Schema, model } from "mongoose"
import { ISubEvent } from "../types/models"

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

const SubEvent = model<ISubEvent>("SubEvent", SubEventSchema)
export default SubEvent
