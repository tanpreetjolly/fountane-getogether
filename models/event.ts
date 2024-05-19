import { Schema, model } from "mongoose"
import { ISubEvent, IEvent } from "../types/models"

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
    },
    { timestamps: true },
)

const EventSchema = new Schema<IEvent>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
        },
        host: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide Host."],
        },
        startDate: {
            type: Date,
            required: [true, "Please Provide Start Date."],
        },
        endDate: {
            type: Date,
            required: [true, "Please Provide End Date."],
        },
        budget: {
            type: Number,
            required: [true, "Please Provide Budget."],
        },
        //this is referenced document
        vendorsList: [
            {
                type: Schema.Types.ObjectId,
                ref: "VendorListEvent",
            },
        ],
        //this is referenced document
        guestsList: [
            {
                type: Schema.Types.ObjectId,
                ref: "GuestListEvent",
            },
        ],
        //this is embedded document
        subEvents: [
            {
                type: SubEventSchema,
            },
        ],
    },
    { timestamps: true },
)

const Event = model<IEvent>("Event", EventSchema)
export default Event
