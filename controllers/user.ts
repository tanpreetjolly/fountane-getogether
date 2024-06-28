import { User, Event, ChatMessage, Channel, VendorProfile } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Request, Response } from "express"
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
    saveImage,
} from "../utils/imageHandlers/cloudinary"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"
import { generateChatId } from "../utils/utilFunctions"
import { create } from "domain"

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
        serviceList: {
            $elemMatch: {
                //@ts-ignore
                vendorProfile: user.vendorProfile?._id,
                status: "accepted",
            },
        },
    })
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name email phoneNo profileImage",
        })

    const eventsNotifications = await Event.find({
        $or: [
            {
                host: user._id,
                serviceList: {
                    $elemMatch: {
                        vendorProfile: user.vendorProfile,
                        status: "pending",
                        offerBy: "vendor",
                    },
                },
            },
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
        .populate("serviceList.vendorProfile")

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
                    //@ts-ignore
                    (service.vendorProfile._id.toString() ===
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

    await User.findByIdAndUpdate(req.user.userId, {
        $addToSet: { myChats: otherUserId },
    })
    await User.findByIdAndUpdate(otherUserId, {
        $addToSet: { myChats: req.user.userId },
    })

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
    const channel = await Channel.findById(channelId).select(
        "name allowedUsers type",
    )

    if (!channel) throw new NotFoundError("Channel Not Found")

    const isUserAllowedInChannel = channel.allowedUsers.some(
        (allowedUser) =>
            // @ts-ignore
            allowedUser.toString() === req.user.userId ||
            // @ts-ignore
            allowedUser.toString() === req.user.vendorProfile,
    )
    if (!isUserAllowedInChannel)
        throw new UnauthenticatedError(
            "You are not allowed to send message to this channel",
        )

    const messages = await ChatMessage.find({ chatId: channelId }).sort({
        createdAt: 1,
    })

    console.log(channel.allowedUsers)

    const allowedUsers = await User.find({
        //@ts-ignore
        _id: { $in: channel.allowedUsers },
    }).select("name email phoneNo profileImage")

    const vendorProfile = await VendorProfile.find({
        //@ts-ignore
        _id: { $in: channel.allowedUsers },
    })
        .select("user")
        .populate({
            path: "user",
            select: "name email phoneNo profileImage",
        })

    res.status(StatusCodes.OK).json({
        data: {
            messages,
            channelDetails: {
                _id: channel._id,
                name: channel.name,
                type: channel.type,
                allowedUsers: [
                    ...allowedUsers,
                    ...vendorProfile.map((vp) => vp.user),
                ],
            },
        },
        success: true,
        msg: "Messages Fetched Successfully",
    })
}

const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) throw new BadRequestError("Image is required")
    const url = await saveImage(req)
    res.status(StatusCodes.OK).json({
        data: { imageUrl: url },
        success: true,
        msg: "Image Uploaded Successfully",
    })
}
const getOtherUserDetails = async (req: Request, res: Response) => {
    const { otherUserId } = req.params
    const user = await User.findById(otherUserId).select(
        "name email profileImage",
    )
    if (!user) throw new NotFoundError("User Not Found")
    res.status(StatusCodes.OK).json({
        data: user,
        success: true,
        msg: "User Fetched Successfully",
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
    uploadImage,
    getOtherUserDetails,
}
