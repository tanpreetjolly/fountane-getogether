import { Schema, model, Types } from "mongoose"
import { IEvent, IUserList, IVendorList } from "../types/models"
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
        // role: {
        //     type: String,
        //     // enum: Array.from(Object.values(ROLES)),
        //     // required: [true, "Please Provide Role."],
        //     default: ROLES.GUEST,
        // },
        // permission: [
        //     {
        //         type: String,
        //         enum: Array.from(Object.values(PERMISSIONS)),
        //     },
        // ],
        subEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubEvent",
            },
        ],
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
        },
    },
    { timestamps: true },
)

UserList.index({ user: 1 })

const VendorList = new Schema<IVendorList>(
    {
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "VendorProfile",
            required: [true, "Please Provide Vendor."],
        },
        // permission: [
        //     {
        //         type: String,
        //         enum: Array.from(Object.values(PERMISSIONS)),
        //     },
        // ],
        subEvents: [
            {
                subEvent: {
                    type: Schema.Types.ObjectId,
                    ref: "SubEvent",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["accepted", "rejected", "pending"],
                    default: "pending",
                },
                servicesOffering: [{ type: String, required: true }],
                amount: {
                    type: Number,
                    required: [true, "Please Provide Amount."],
                },
                paymentStatus: {
                    type: String,
                    required: [true, "Please Provide Status."],
                    enum: ["pending", "paid", "failed"],
                    default: "pending",
                },
            },
        ],
    },
    { timestamps: true },
)

VendorList.index({ vendorId: 1 })

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
        eventType: {
            type: String,
            required: [true, "Please Provide Event Type."],
            lowercase: true,
        },
        //this is embedded document
        userList: [UserList],
        vendorList: [VendorList],
        //this is ref document
        subEvents: {
            type: [Schema.Types.ObjectId],
            ref: "SubEvent",
        },
    },
    { timestamps: true },
)

// EventSchema.index({ "userList.user": 1 })

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
