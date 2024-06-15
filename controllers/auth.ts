import { User } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors"
import { OTP, IUser } from "../types/models"
import { Request, Response } from "express"
import SendMail from "../utils/sendMail"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"
import { OAuth2Client } from "google-auth-library"
import { io } from "../socketio"

const client = new OAuth2Client()

const register = async (req: Request, res: Response) => {
    const {
        firstName,
        lastName,
        email,
        phoneNo,
        password,
        profileImage,
        isVendor,
    } = req.body

    //data validation
    const name = firstName + " " + lastName
    if (!name || !email) throw new BadRequestError("Please provide all details")
    if (!password) throw new BadRequestError("Please provide password")

    const userExist: IUser | null = await User.findOne({ email }) // Using findOne

    if (userExist && userExist.status === "active") {
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            msg: "User with this email already exists",
        }) // Conflict status
    }
    if (userExist && userExist.status === "blocked") {
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            msg: "User with this email is blocked.",
        }) // Forbidden status
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    const otp: OTP = {
        value: otpCode,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }

    const newUser = {
        name,
        email,
        phoneNo,
        password,
        profileImage,
        status: "inactive",
        otp,
    }

    let userId

    if (userExist) {
        switch (userExist.status) {
            case "inactive":
                const user = await User.findByIdAndUpdate(
                    userExist._id,
                    newUser,
                    {
                        new: true,
                    },
                )
                if (user && isVendor && !user.vendorProfile)
                    await user.makeVendor()
                else if (user && !isVendor && user.vendorProfile)
                    await user.removeVendor()

                userId = user?._id
                break

            case "blocked":
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    msg: "User with this email is blocked.",
                }) // Forbidden status

            case "active":
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    msg: "User with this email already exists",
                }) // Conflict status

            default:
                break
        }
    } else {
        const user = await User.create(newUser)
        if (isVendor === true) await user.makeVendor()
        userId = user._id
    }
    if (!userId) throw new BadRequestError("User not created.")

    await SendMail({
        from: process.env.SMTP_EMAIL_USER,
        to: email,
        subject: "Blogmind: Email Verification",
        text: `Thank you for registering with Blogmind! Your OTP (One-Time Password) is ${otpCode}. Please use this code to verify your email. ${isVendor ? "You are registering as a vendor." : ""}`,
        html: `<h1>Thank you for registering with Blogmind!</h1><p>Your OTP (One-Time Password) is <strong>${otpCode}</strong>. Please use this code to verify your email.</p> ${isVendor ? "<p>You are registering as a vendor.</p>" : ""}`,
    })

    res.status(StatusCodes.CREATED).json({
        data: {
            userId: userId,
        },
        success: true,
        msg: "OTP sent to your email. Please verify your email.",
    })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email && !password)
        throw new BadRequestError("Please provide email and password")
    else if (!email) throw new BadRequestError("Please provide email")
    else if (!password) throw new BadRequestError("Please provide password")

    const user = await User.findOne({ email })

    if (!user) throw new UnauthenticatedError("Email Not Registered.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")

    if (!user.password)
        throw new UnauthenticatedError(
            "Please login with Google.\nOr Reset Password.",
        )

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Password.")

    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "User Login Successfully",
    })
}

const continueWithGoogle = async (req: Request, res: Response) => {
    const tokenId = req.body.tokenId
    const isVendor = req.body.isVendor

    let payload: any = null

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        payload = ticket.getPayload()
    } catch (error) {
        console.log(error)
        throw new BadRequestError("Invalid Token")
    }

    const { email, name, picture } = payload
    let user = await User.findOne({ email })
    if (user) {
        if (user.status === "blocked")
            throw new UnauthenticatedError("User is blocked.")
    } else {
        user = await User.create({
            name,
            email,
            profileImage: picture,
            status: "active",
        })
        if (isVendor === true) await user.makeVendor()
    }
    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Google Login Successfully",
    })
}

const forgotPasswordSendOtp = async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) throw new BadRequestError("Please provide email")
    const user = await User.findOne({ email })
    if (!user) throw new UnauthenticatedError("Email Not Registered.")
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otp: OTP = {
        value: otpCode,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }
    user.otp = otp
    await user.save()
    await SendMail({
        from: process.env.SMTP_EMAIL_USER,
        to: email,
        subject: "Blogmind: Reset Password",
        text: `Your OTP (One-Time Password) is ${otpCode}. Please use this code to reset your password.`,
        html: `<h1>Your OTP (One-Time Password) is <strong>${otpCode}</strong>. Please use this code to reset your password.</h1>`,
    })
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "OTP sent to your email. Please verify your email.",
    })
}

const forgotPasswordVerifyOtp = async (req: Request, res: Response) => {
    const { otp, email, password } = req.body as {
        otp: string
        email: string
        password: string
    }
    if (!otp) throw new BadRequestError("Please provide OTP")
    const user = await User.findOne({ email, "otp.value": otp })
    if (!user) throw new UnauthenticatedError("Invalid OTP.")
    if (user.otp && user.otp.expires < new Date()) {
        user.otp = undefined
        throw new UnauthenticatedError("OTP Expired.Please try again.")
    }
    user.otp = undefined
    user.password = password
    await user.save()
    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Password Changed Successfully",
    })
}

const verifyEmail = async (req: Request, res: Response) => {
    const { otp, userId } = req.body as { otp: string; userId: string }
    if (!otp) throw new BadRequestError("Please provide OTP")

    const user = await User.findById(userId)
    if (!user) throw new UnauthenticatedError("User Not Found")

    if (user.status === "active")
        throw new UnauthenticatedError("User is already active.")

    if (user.status === "blocked")
        throw new UnauthenticatedError(
            "User is blocked. Please Reach out to support.",
        )

    if (!user.otp) throw new UnauthenticatedError("OTP Not Found")
    if (user.otp.value !== otp.toString())
        throw new UnauthenticatedError("Wrong OTP.")

    if (user.otp && user.otp.expires < new Date()) {
        user.otp = undefined
        throw new UnauthenticatedError("OTP Expired. Please register again.")
    }
    user.status = "active"
    user.otp = undefined
    await user.save()
    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "User Registered Successfully",
    })
}

const signOut = async (req: Request, res: Response) => {
    //clear all cookies
    for (const cookie in req.cookies) {
        res.clearCookie(cookie)
    }

    io?.sockets.sockets.forEach((socket) => {
        if (socket.user.userId.toString() === req.user?.userId.toString()) {
            socket.disconnect()
        }
    })

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "User Logout Successfully",
    })
}

export {
    register,
    login,
    continueWithGoogle,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
    verifyEmail,
    signOut,
}
