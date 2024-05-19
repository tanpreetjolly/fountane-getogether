import { Schema, model } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { IUser } from "../types/models"

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Please provide email."],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email.",
            ],
            unique: true,
        },
        phoneNo: {
            type: String,
            match: [
                /(\+?\d{1,3}[- ]?)?\d{10}/,
                "Please provide valid phone number.",
            ],
        },
        password: {
            type: String,
            minlength: 8,
        },
        profileImage: {
            type: String,
            default:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "inactive",
        },
        otp: {
            value: {
                type: String,
            },
            expires: {
                type: Date,
            },
        },
        vendorProfile: {
            type: Schema.Types.ObjectId,
            ref: "VendorProfile",
            default: null,
        },
    },
    {
        timestamps: true,
    },
)

const preSave = async function (this: any, next: (err?: Error) => void) {
    if (!this.isModified("password")) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error: any) {
        return next(error)
    }
}

UserSchema.pre("save", preSave)

UserSchema.methods.generateToken = function () {
    return jwt.sign(
        { userId: this._id, isVendor: this.vendorProfile ? true : false },
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    )
}

UserSchema.methods.comparePassword = async function (
    password: IUser["password"],
) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}
const User = model<IUser>("User", UserSchema)
export default User
