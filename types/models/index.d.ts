import { Schema, Types, Model } from "mongoose"

export interface OTP {
    value: string
    expires: Date
}

export interface IUser extends Document {
    _id?: Types.ObjectId
    name: string
    email: string
    phoneNo: string
    password: string
    profileImage: string
    status: string
    otp: OTP | undefined
    vendorProfile: Schema.Types.ObjectId
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

export interface IGuestListEvent extends Document {
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

export interface IVendorListEvent extends Document {
    vendorId: Schema.Types.ObjectId
    subEvents: Schema.Types.ObjectId
    status: string
    serviceOffering: string
    paymentStatus: IPayment
    createdAt: Date
    updatedAt: Date
}

export interface ISubEvent {
    name: string
    startDate: Date
    endDate: Date
    venue: string
    channels: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
}
export interface IEvent extends Document {
    name: string
    host: Schema.Types.ObjectId
    startDate: Date
    endDate: Date
    budget: number
    vendorsList: Types.Array<Schema.Types.ObjectId>
    guestsList: Types.Array<Schema.Types.ObjectId>
    subEvents: Types.Array<ISubEvent>
    createdAt: Date
    updatedAt: Date
}

export interface IChatMessage extends Document {
    _id?: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    channelId: Schema.Types.ObjectId
    message: string
    createdAt: Date
    updatedAt: Date
}

export interface IChannel extends Document {
    name: string
    // chat: Types.Array<Schema.Types.ObjectId>
    allowedUsers: Types.Array<Schema.Types.ObjectId>
    createdAt: Date
    updatedAt: Date
}
