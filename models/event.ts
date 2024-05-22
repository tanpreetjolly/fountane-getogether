import { Schema, model } from "mongoose"
import { ISubEvent, IEvent, IUserList } from "../types/models"
import jwt from "jsonwebtoken"
import { NotFoundError } from "../errors"

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
const UserList = new Schema<IUserList>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Please Provide User."],
        },
        role: {
            type: String,
            enum: ["Guest", "Vendor"],
            required: [true, "Please Provide Role."],
        },
        permission: {
            type: String,
            enum: ["editTask", "viewTask", "editEvent", "viewEvent"],
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
        //these are embedded documents
        userList: [UserList],
        subEvents: [SubEventSchema],
    },
    { timestamps: true },
)

EventSchema.methods.generateToken = function (userId: Schema.Types.ObjectId) {
    const isHost = this.host.toString() === userId.toString()
    const user = this.userList.find(
        (user: IUserList) => user.userId.toString() === userId.toString(),
    )
    if (!user && !isHost)
        throw new NotFoundError("User is not part of this event.")
    const permission = user?.permission
    const role = user?.role

    return jwt.sign(
        {
            userId: this._id,
            role,
            isHost,
            permission,
        },
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    )
}

const Event = model<IEvent>("Event", EventSchema)
export default Event
