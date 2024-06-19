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
    myChats: Types.Array<Schema.Types.ObjectId>
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
    serviceImage: string
    items: Types.Array<{
        _id: Schema.Types.ObjectId
        name: string
        description: string
        price: number
    }>
}

export interface IVendorProfile extends Document {
    user: Schema.Types.ObjectId
    services: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
}

export interface IServiceList extends Document {
    _id: string
    vendorProfile: Schema.Types.ObjectId
    subEvent: Schema.Types.ObjectId
    estimatedGuests: string
    status: string
    offerBy: string
    servicesOffering: Schema.Types.ObjectId
    planSelected: {
        name: string
        description: string
        price: number
    }
    paymentStatus: string
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
    subEvents: [Schema.Types.ObjectId]
    status: string
    expectedGuests: number
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
    serviceList: Types.Array<IServiceList>
    subEvents: Types.Array<Schema.Types.ObjectId>
    checkList: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
    eventType: string
    generateToken: (userId: string) => string
}

export interface IChatMessage extends Document {
    _id: Schema.Types.ObjectId
    senderId: Schema.Types.ObjectId
    chatId: Schema.Types.ObjectId
    message: string
    image: Types.Array<string>
    createdAt: Date
    updatedAt: Date
}

export interface IChannel extends Document {
    _id: Schema.Types.ObjectId
    name: string
    allowedUsers: Types.Array<Schema.Types.ObjectId>
    type: CHANNEL_TYPES
    createdAt: Date
    updatedAt: Date
}
