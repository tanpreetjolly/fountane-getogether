import { Schema, Types, Model } from "mongoose"

export interface OTP {
    value: string
    expires: Date
}

export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    phoneNo: string
    password: string
    profileImage: string
    status: string
    otp: OTP | undefined
    vendorProfile: Schema.Types.ObjectId | null
    createdAt: Date
    updatedAt: Date
    generateToken: () => string
    generateSocketToken: () => string
    comparePassword: (password: string) => Promise<boolean>
    makeVendor: () => Promise<Schema.Types.ObjectId | false>
    removeVendor: () => Promise<void>
}

export interface IServices extends Document {
    serviceName: string
    serviceDescription: string
    price: number
}

export interface IVendorProfile extends Document {
    user: Schema.Types.ObjectId
    services: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
}

export interface IVendorList extends Document {
    _id: string
    vendorProfile: Schema.Types.ObjectId
    // permission: [string]
    subEvents: [
        {
            _id: string
            subEvent: Schema.Types.ObjectId
            status: string
            servicesOffering: Schema.Types.ObjectId
            paymentStatus: string
            amount: number
        },
    ]
    createdAt: Date
    updatedAt: Date
}

export interface ISubEvent {
    _id: Schema.Types.ObjectId
    name: string
    startDate: Date
    endDate: Date
    venue: string
    channels: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
}

export interface ITask extends Document {
    eventId: Schema.Types.ObjectId
    name: string
    completed: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IUserList {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    // role: string
    permission: [string]
    subEvents: [Schema.Types.ObjectId]
    status: string
    createdAt: Date
    updatedAt: Date
}
export interface IEvent extends Document {
    _id: Schema.Types.ObjectId
    name: string
    host: Schema.Types.ObjectId
    startDate: Date
    endDate: Date
    budget: number
    userList: Types.Array<IUserList>
    vendorList: Types.Array<IVendorList>
    subEvents: Types.Array<Schema.Types.ObjectId>
    checkList: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
    eventType: string
    generateToken: (userId: Types.ObjectId) => string
}

export interface IChatMessage extends Document {
    _id: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    channelId: Schema.Types.ObjectId
    message: string
    createdAt: Date
    updatedAt: Date
}

export interface IChannel extends Document {
    _id: Schema.Types.ObjectId
    name: string
    allowedUsers: Types.Array<Schema.Types.ObjectId>
    // allowedRoles: Types.Array<ROLES>
    type: CHANNEL_TYPES
    createdAt: Date
    updatedAt: Date
}
