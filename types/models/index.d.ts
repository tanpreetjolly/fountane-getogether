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

export interface IVendorProfile extends Document {
    userId: Schema.Types.ObjectId
    services: [
        {
            serviceName: string
            serviceDescription: string
            price: number
        },
    ]
    createdAt: Date
    updatedAt: Date
}

export interface IGuest extends Document {
    guestId: Schema.Types.ObjectId
    subEvent: Schema.Types.ObjectId
    status: string
    createdAt: Date
    updatedAt: Date
}

export interface IPayment {
    amount: number
    status: string
    createdAt: Date
    updatedAt: Date
}

export interface IVendor extends Document {
    vendorId: Schema.Types.ObjectId
    subEvents: Schema.Types.ObjectId
    status: string
    serviceOffering: string
    paymentStatus: IPayment
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
    user: Schema.Types.ObjectId
    role: string
    permission: [string]
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
    allowedRoles: [string]
    type: string
    createdAt: Date
    updatedAt: Date
}
