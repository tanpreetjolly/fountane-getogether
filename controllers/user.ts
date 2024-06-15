import { User, Event, ChatMessage, Channel } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Request, Response } from "express"
import mongoose from "mongoose"
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
} from "../utils/imageHandlers/cloudinary"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"
import { generateChatId } from "../utils/utilFunctions"

const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.userId).populate([
        {
            path: "vendorProfile",
            populate: {
                path: "services",
            },
        },
        {
            path: "myChats",
            select: "name email phoneNo profileImage",
        },
    ])
    if (!user) throw new NotFoundError("User Not Found")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")

    setAuthTokenCookie(res, user)

    const socketToken = user.generateSocketToken()

    const events = await Event.find({
        $or: [
            { host: user._id },
            { "userList.user": user._id, "userList.status": "accepted" },
        ],
    })
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name email phoneNo profileImage",
        })

    const serviceEvents = await Event.find({
        $or: [
            {
                // @ts-ignore
                "serviceList.vendorProfile": user.vendorProfile?._id,
                "serviceList.status": "accepted",
            },
        ],
    })
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name email phoneNo profileImage",
        })

    const eventsNotifications = await Event.find({
        $or: [
            {
                userList: {
                    $elemMatch: {
                        user: user._id,
                        status: "pending",
                    },
                },
            },
            {
                serviceList: {
                    $elemMatch: {
                        vendorProfile: user.vendorProfile,
                        status: "pending",
                    },
                },
            },
        ],
    })
        .select("name host startDate endDate userList serviceList")
        .populate({
            path: "host",
            select: "name profileImage email phoneNo",
        })
        .populate({
            path: "userList.subEvents",
            select: "name startDate endDate venue",
        })
        .populate({
            path: "serviceList.subEvent",
            select: "name startDate endDate venue",
        })
        .populate("serviceList.servicesOffering")

    // console.log(eventsNotifications);

    const notifications = eventsNotifications.map((event) => {
        return {
            ...event.toJSON(),
            userList: event.userList.find(
                (user) =>
                    user.user.toString() === req.user.userId.toString() &&
                    user.status === "pending",
            ),
            serviceList: event.serviceList.filter(
                (service) =>
                    (service.vendorProfile.toString() ===
                        //@ts-ignore
                        user?.vendorProfile?._id?.toString() ||
                        null) &&
                    service.status === "pending",
            ),
        }
    })

    const sendUser = {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        profileImage: user.profileImage,
        isVendor: user.vendorProfile ? true : false,
        vendorProfile: user.vendorProfile,
        myChats: user.myChats,
        events: events,
        notifications: notifications,
        serviceEvents: serviceEvents,
        socketToken,
    }

    res.status(StatusCodes.OK).json({
        data: sendUser,
        success: true,
        msg: "User Fetched Successfully",
    })
}

const updateUser = async (userId: string, key: string, value: any) => {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError("User Not Found")
    user.set({ [key]: value })
    await user.save()
}

const updateCompleteProfile = async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = req.user.userId

    if (!name) throw new BadRequestError("Name or Phone Number are required")

    const user = await User.findByIdAndUpdate(userId, {
        name,
    })

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Profile Updated Successfully",
    })
}

const updateProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId
    if (!req.file) throw new BadRequestError("Image is required")

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")

    const cloudinary_img_url = await cloudinaryUploadProfileImage(req)
    await updateUser(userId, "profileImage", cloudinary_img_url)

    res.status(StatusCodes.OK).json({
        data: { profileImage: cloudinary_img_url },
        success: true,
        msg: "Image Updated Successfully",
    })
}

const deleteProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")
    await updateUser(
        userId,
        "profileImage",
        "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
    )

    res.status(StatusCodes.OK).json({
        data: {
            defaultProfileImage:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        success: true,
        msg: "Image Deleted Successfully",
    })
}

const makeMeVendor = async (req: Request, res: Response) => {
    const userId = req.user.userId
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError("User Not Found")
    if (user.vendorProfile)
        throw new BadRequestError("User is already a vendor.")
    const vendorProfile = await user.makeVendor()
    if (!vendorProfile)
        throw new BadRequestError("Failed to make user a vendor.")
    res.status(StatusCodes.CREATED).json({
        data: { vendorProfile },
        success: true,
        msg: "User is now a vendor.",
    })
}

const getChatMessages = async (req: Request, res: Response) => {
    const { chatId: otherUserId } = req.params

    // if req.user already have chatId then return messages of that chatId
    // else insert chatId in req.user.myChats and return messages of that chatId

    const mySelf = await User.findById(req.user.userId)
    if (!mySelf) throw new NotFoundError("User Not Found")
    if (!mySelf.myChats.some((chat) => chat.toString() === otherUserId)) {
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { myChats: otherUserId },
        })
        await User.findByIdAndUpdate(
            otherUserId,
            {
                $push: { myChats: req.user.userId },
            },
            {
                new: true,
            },
        )
    }

    const chatId = generateChatId(req.user.userId.toString(), otherUserId)
    const messages = await ChatMessage.find({ chatId }).sort({ createdAt: 1 })

    const otherUser = await User.findById(otherUserId).select(
        "name email phoneNo profileImage",
    )

    res.status(StatusCodes.OK).json({
        data: { messages, otherUser },
        success: true,
        msg: "Messages Fetched Successfully",
    })
}

const getChannelMessages = async (req: Request, res: Response) => {
    const { channelId } = req.params
    const channelDetails = await Channel.findById(channelId)
        .select("name allowedUsers")
        .populate({
            path: "allowedUsers",
            select: "name email phoneNo profileImage",
        })
    if (!channelDetails) throw new NotFoundError("Channel Not Found")

    const isUserAllowedInChannel = channelDetails.allowedUsers.some(
        (user) =>
            // @ts-ignore
            user._id.toString() === req.user.userId.toString() ||
            // @ts-ignore
            user._id.toString() === req.user.vendorProfile?.toString(),
    )
    if (!isUserAllowedInChannel)
        throw new UnauthenticatedError(
            "You are not allowed to send message to this channel",
        )

    const messages = await ChatMessage.find({ chatId: channelId }).sort({
        createdAt: 1,
    })

    res.status(StatusCodes.OK).json({
        data: { messages, channelDetails },
        success: true,
        msg: "Messages Fetched Successfully",
    })
}

export {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    makeMeVendor,
    getChatMessages,
    getChannelMessages,
}
