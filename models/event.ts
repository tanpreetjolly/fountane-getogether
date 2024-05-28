import { Schema, model, Types } from "mongoose"
import { IEvent, IUserList } from "../types/models"
import { PERMISSIONS, CHANNEL_TYPES, ROLES } from "../values"
import jwt from "jsonwebtoken"
import { NotFoundError } from "../errors"
import { EventPayload } from "../types/express"

const UserList = new Schema<IUserList>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide User."],
        },
        role: {
            type: String,
            enum: Array.from(Object.values(ROLES)),
            required: [true, "Please Provide Role."],
        },
        permission: [
            {
                type: String,
                enum: Array.from(Object.values(PERMISSIONS)),
            },
        ],
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
        //this is embedded document
        userList: [UserList],
        //this is ref document
        subEvents: {
            type: [Schema.Types.ObjectId],
            ref: "SubEvent",
        },
        eventType: {
            type: String,
            required: [true, "Please Provide Event Type."],
            lowercase: true,
        },
    },
    { timestamps: true },
)

EventSchema.index({ "userList.user": 1 })

EventSchema.pre("save", function (next) {
    if (this.isNew === true) {
        //assign host to user list with all permissions
        console.log(this.host)

        this.userList.push({
            user: this.host,
            role: ROLES.HOST,
            permission: Array.from(Object.values(PERMISSIONS)),
        })
    }
    // if (this.isModified("userList")) {
    //     this.userList.forEach((user) => {
    //         if (user.permission.length === 0) {
    //             user.permission = Array.from(Object.values(PERMISSIONS))
    //         }
    //     })
    // }
    next()
})

EventSchema.methods.generateToken = function (userId: Types.ObjectId) {
    const isHost = this.host.toString() === userId.toString()
    const user = this.userList.find(
        (user: IUserList) => user.user.toString() === userId.toString(),
    )
    if (!user && !isHost)
        throw new NotFoundError("User is not part of this event.")
    const permission = user?.permission
    const role = user?.role

    return jwt.sign(
        {
            eventId: this._id,
            role,
            isHost,
            permission,
        } as EventPayload,
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    )
}

const Event = model<IEvent>("Event", EventSchema)
export default Event
