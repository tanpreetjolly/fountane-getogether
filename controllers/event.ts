import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import {
    Channel,
    Event,
    Services,
    SubEvent,
    Task,
    User,
    VendorProfile,
} from "../models"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"
import { CHANNEL_TYPES, ROLES } from "../values"
import sendMail from "../utils/sendMail"
import { InvitationTokenPayload, UserPayload } from "../types/express"
import jwt from "jsonwebtoken"

function filterSubEvents(
    subEvents: any[],
    isGuest: any | undefined,
    isVendor: any[],
    user: UserPayload,
) {
    const subEventsAllowedSet = new Set<string>()

    isGuest?.subEvents.forEach((subEventId: any) =>
        subEventsAllowedSet.add(subEventId.toString()),
    )
    isVendor.forEach((service) => {
        subEventsAllowedSet.add(service.subEvent._id.toString())
    })

    const subEventsAllowed = Array.from(subEventsAllowedSet)
    const allowedSubEvents = subEvents.filter((subEvent) =>
        subEventsAllowed.includes(subEvent._id.toString()),
    )
    return allowedSubEvents.map((subEvent) => {
        return {
            ...subEvent.toJSON(),
            channels: subEvent.channels.filter(
                (channel: any) =>
                    channel.allowedUsers.some(
                        (allowedUser: any) =>
                            allowedUser.toString() === user.userId,
                    ) ||
                    channel.allowedUsers.some(
                        (allowedUser: any) =>
                            allowedUser.toString() === user.vendorProfile,
                    ),
            ),
        }
    })
}

export const getEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params

    const event = await Event.findById(eventId).populate([
        {
            path: "host",
            select: "name email phoneNo profileImage",
        },
        {
            path: "userList",
            populate: {
                path: "user",
                select: "name email phoneNo profileImage",
            },
        },
        {
            path: "serviceList",
            populate: [
                {
                    path: "vendorProfile",
                    populate: {
                        path: "user",
                        select: "name email phoneNo profileImage",
                    },
                },
                {
                    path: "subEvent servicesOffering",
                },
            ],
        },
        {
            path: "subEvents",
            populate: {
                path: "channels",
            },
        },
    ])

    if (!event) throw new NotFoundError("Event Not Found")

    const user = req.user

    //@ts-ignore
    const isHosted = event.host._id.toString() === user.userId
    const isGuest = event.userList.find(
        (userListItem) =>
            //@ts-ignore
            userListItem.user._id.toString() === user?.userId &&
            userListItem.status === "accepted",
    )
    const isVendor = event.serviceList.filter(
        (service) =>
            //@ts-ignore
            service.vendorProfile._id.toString() === user?.vendorProfile &&
            service.status === "accepted",
    )

    const data = {
        _id: event._id,
        name: event.name,
        host: event.host,
        startDate: event.startDate,
        endDate: event.endDate,
        eventType: event.eventType,
        budget: event.budget,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        isHosted,
        isGuest,
        isVendor: isVendor.length > 0 ? isVendor : undefined,
        checkList: isHosted ? await Task.find({ eventId }) : [],
        //only subEvents are visible in which they are invited
        subEvents: isHosted
            ? event.subEvents
            : filterSubEvents(event.subEvents, isGuest, isVendor, user),
        //userList is only available to host
        userList: isHosted ? event.userList : [],
        //serviceList is available to host and vendor
        serviceList: isHosted
            ? event.serviceList
            : isVendor.length > 0
              ? event.serviceList
                    .filter((service) => service.status === "accepted")
                    .map((service) => {
                        //@ts-ignore
                        const { amount, ...rest } = service.toJSON()
                        return rest
                    })
              : [],
    }

    res.status(StatusCodes.OK).json({
        data,
        success: true,
        msg: "Event Fetched Successfully",
    })
}

export const createEvent = async (req: Request, res: Response) => {
    const { name, startDate, endDate, budget, eventType } = req.body
    const host = req.user

    const createEvent = new Event({
        name,
        startDate,
        endDate,
        budget,
        host: host.userId,
        eventType,
    })

    await createEvent.save()

    const event = await Event.findById(createEvent._id)
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name profileImage email phoneNo",
        })

    res.status(StatusCodes.CREATED).json({
        data: event,
        success: true,
        msg: `Event ${name} Created`,
    })
}

export const createSubEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { name, startDate, endDate, venue } = req.body

    const event = await Event.findById(eventId).select(
        "userList serviceList subEvents",
    )

    if (!event) throw new NotFoundError("Event Not Found")

    console.log(event.serviceList)

    const allUserListId = new Set()
    event.userList.forEach((user) => {
        allUserListId.add(user.user)
    })
    event.serviceList.forEach((service) => {
        allUserListId.add(service.vendorProfile)
    })

    const newSubEventChannels = [
        {
            name: "Announcement",
            allowedUsers: Array.from(allUserListId),
            type: CHANNEL_TYPES.ANNOUNCEMENT,
        },
        {
            name: "Vendors Only",
            allowedUsers: event.serviceList.map((user) => user.vendorProfile),
            type: CHANNEL_TYPES.VENDORS_ONLY,
        },
        {
            name: "Guests Only",
            allowedUsers: event.userList.map((user) => user.user),
            type: CHANNEL_TYPES.GUESTS_ONLY,
        },
    ].map(async (channelData) => {
        const newChannel = await Channel.create(channelData)
        return newChannel
    })

    const subEvent = await SubEvent.create({
        name,
        startDate,
        endDate,
        venue,
        channels: await Promise.all(newSubEventChannels),
    })

    event.subEvents.push(subEvent._id)
    await event.save()

    res.status(201).json({
        data: { subEventId: subEvent._id },
        success: true,
        msg: "Sub Event Created Successfully",
    })
}

export const updateEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { name, startDate, endDate, budget, eventType } = req.body

    const event = await Event.findByIdAndUpdate(
        eventId,
        {
            name,
            startDate,
            endDate,
            budget,
            eventType,
        },
        { new: true },
    )
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name profileImage",
        })

    if (!event) throw new NotFoundError("Event Not Found")

    res.status(200).json({
        data: event,
        success: true,
        msg: "Event Updated Successfully",
    })
}

export const deleteEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params

    const event = await Event.findByIdAndDelete(eventId)

    if (!event) throw new NotFoundError("Event Not Found")

    res.status(200).json({
        success: true,
        msg: "Event Deleted Successfully",
    })
}

export const createSubEventChannel = async (req: Request, res: Response) => {
    const { eventId, subEventId } = req.params
    const { name, allowedUsers } = req.body
    if (name === "") throw new BadRequestError("Channel Name is required")

    // make a set of allowedUsers
    const allowedUsersSetArray = Array.from(new Set(allowedUsers))
    //check all allowed users are mongoose object id
    const isValid = allowedUsersSetArray.every((id: any) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid User Ids")
    const channel = await Channel.create({
        name,
        allowedUsers: allowedUsersSetArray,
        type: CHANNEL_TYPES.OTHER,
    })

    const subEvent = await SubEvent.findByIdAndUpdate(subEventId, {
        $push: { channels: channel._id },
    })

    if (!subEvent) {
        // delete channel
        await Channel.findByIdAndDelete(channel._id)
        throw new NotFoundError("Sub Event Not Found")
    }
    res.status(StatusCodes.CREATED).json({
        data: { channelId: channel._id },
        success: true,
        msg: `Channel ${name} Created`,
    })
}

export const inviteGuest = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { guestId, subEventsIds } = req.body
    const role = ROLES.GUEST

    const isValid = subEventsIds.every((id: any) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid SubEvent Ids")

    const event = await Event.findById(eventId).populate({
        path: "host",
        select: "name email",
    })
    if (!event) throw new BadRequestError("Event not found")

    const user = await User.findById(guestId)
    if (!user) throw new BadRequestError("User not found")

    const subEvents = await SubEvent.find({ _id: { $in: subEventsIds } })

    const guestIndex = event.userList.findIndex(
        (guest) => guest.user.toString() === guestId,
    )

    if (guestIndex !== -1) {
        // Guest exists, update their subEvents
        if (subEventsIds.length === 0) {
            event.userList.splice(guestIndex, 1)
        } else {
            event.userList[guestIndex].subEvents = subEventsIds
            event.userList[guestIndex].status = "pending"
        }
    } else if (subEventsIds.length > 0) {
        // Guest does not exist, add new guest
        event.userList.push({ user: guestId, role, subEvents: subEventsIds })
    }

    await event.save()

    //@ts-ignore
    const hostName = event.host.name
    const token = jwt.sign(
        {
            eventId,
            userListId: event.userList.find(
                (user) => user.user.toString() === guestId,
            )?._id,
        },
        process.env.JWT_SECRET as jwt.Secret,
    )
    const invitationURL = `${process.env.CLIENT_URL}/invitation?token=${token}`

    if (subEventsIds.length > 0) {
        sendMail({
            to: user.email,
            subject: `You have been invited to the event ${event.name}`,
            // @ts-ignore
            text: `Dear ${user.name}, You have been invited to the event "${event.name}" by ${hostName}. We are excited to have you join us for this special occasion. Below are the details of the sub-events: ${subEvents
                .map((subEvent) => {
                    return ` - ${subEvent.name} at ${subEvent.venue} from ${subEvent.startDate} to ${subEvent.endDate} `
                })
                .join(
                    "",
                )} Please click the link below to confirm your attendance: ${invitationURL} We hope you can make it and look forward to seeing you there. Thank you, ${hostName},`,
            html: `<p>Dear ${user.name},</p> <p>You have been invited to the event <strong>${event.name}</strong> by ${hostName}.</p> <p>We are excited to have you join us for this special occasion. Below are the details of the sub-events:</p> <ul> ${subEvents
                .map((subEvent) => {
                    return `<li><strong>${subEvent.name}</strong> at ${subEvent.venue} from ${subEvent.startDate} to ${subEvent.endDate}</li>`
                })
                .join(
                    "",
                )} </ul> <p>Please click the button below to confirm your attendance:</p> <p><a href="${invitationURL}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">RSVP Accept</a> <a href="${invitationURL}" style="background-color: #f44336; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">No, I can't make it.</a></p> <p>Thank you,<br/>${hostName}</p>`,
        })
    }

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg:
            guestIndex !== -1
                ? "Guest Updated Successfully"
                : "Guest Invited Successfully",
    })
}

export const inviteNewGuest = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { name, email, phoneNo, subEventsIds } = req.body
    const role = ROLES.GUEST

    const isValid = subEventsIds.every((id: any) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid SubEvent Ids")

    const event = await Event.findById(eventId).populate({
        path: "host",
        select: "name email",
    })
    if (!event) throw new BadRequestError("Event not found")

    const user = await User.create({ name, email, phoneNo }).catch((err) => {
        if (err.name === "MongoServerError")
            throw new BadRequestError(`User with email ${email} already exists`)
        throw err
    })
    if (!user) throw new BadRequestError("User not found")

    const subEvents = await SubEvent.find({ _id: { $in: subEventsIds } })

    event.userList.push({ user: user._id, role, subEvents: subEventsIds })

    // let user = await User.findOne({ email }).select("_id name email phoneNo")
    // if (!user) {
    //     user = await User.create({ name, email, phoneNo })

    //     const subEvents = await SubEvent.find({ _id: { $in: subEventsIds } })

    //     event.userList.push({ user: user._id, role, subEvents: subEventsIds })
    // }

    await event.save()

    const userListId = event.userList.find(
        (userListItem) => userListItem.user.toString() === user._id.toString(),
    )?._id

    //@ts-ignore
    const hostName = event.host.name
    const token = jwt.sign(
        {
            eventId,
            userListId,
        },
        process.env.JWT_SECRET as jwt.Secret,
    )
    const invitationURL = `${process.env.CLIENT_URL}/invitation?token=${token}`

    // Send mail (implementation omitted for brevity)
    if (subEventsIds.length > 0) {
        sendMail({
            to: user.email,
            subject: `You have been invited to the event ${event.name}`,
            // @ts-ignore
            text: `Dear ${user.name}, You have been invited to the event "${event.name}" by ${hostName}. We are excited to have you join us for this special occasion. Below are the details of the sub-events: ${subEvents
                .map((subEvent) => {
                    return ` - ${subEvent.name} at ${subEvent.venue} from ${subEvent.startDate} to ${subEvent.endDate} `
                })
                .join(
                    "",
                )} Please click the link below to confirm your attendance: ${invitationURL} We hope you can make it and look forward to seeing you there. Thank you, ${hostName},`,
            html: `<p>Dear ${user.name},</p> <p>You have been invited to the event <strong>${event.name}</strong> by ${hostName}.</p> <p>We are excited to have you join us for this special occasion. Below are the details of the sub-events:</p> <ul> ${subEvents
                .map((subEvent) => {
                    return `<li><strong>${subEvent.name}</strong> at ${subEvent.venue} from ${subEvent.startDate} to ${subEvent.endDate}</li>`
                })
                .join(
                    "",
                )} </ul> <p>Please click the button below to confirm your attendance:</p> <p><a href="${invitationURL}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">RSVP Accept</a> <a href="${invitationURL}" style="background-color: #f44336; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">No, I can't make it.</a></p> <p>Thank you,<br/>${hostName}</p>`,
        })
    }

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Guest Invited Successfully",
    })
}

export const acceptRejectInviteVendor = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { status, serviceListId, offerBy } = req.body

    if (!serviceListId) throw new BadRequestError("ServiceListId is required")

    if (!status) throw new BadRequestError("Status is required")
    const acceptedStatusValues = ["accepted", "rejected", "pending"]
    if (!acceptedStatusValues.includes(status))
        throw new BadRequestError(
            `Status value must be one of ${acceptedStatusValues.join(",")}`,
        )

    const event = await Event.findById(eventId)
    if (!event) throw new NotFoundError("Event Not Found")

    const serviceListItem = event.serviceList.find(
        (service) => service._id.toString() === serviceListId.toString(),
    )
    if (serviceListItem === undefined)
        throw new NotFoundError("Vendor Is Not Part Of This Event")
    serviceListItem.status = status
    serviceListItem.offerBy = offerBy
    await event.save()

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Status Updated Successfully",
    })
}

export const newOfferVendor = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { serviceListId, newOfferPrice, offerBy } = req.body

    if (!serviceListId) throw new BadRequestError("ServiceListId is required")

    const event = await Event.findById(eventId)
    if (!event) throw new NotFoundError("Event Not Found")

    const serviceListItem = event.serviceList.find(
        (service) => service._id.toString() === serviceListId.toString(),
    )
    if (serviceListItem === undefined)
        throw new NotFoundError("Vendor Is Not Part Of This Event")
    if (serviceListItem.status !== "pending")
        throw new BadRequestError(`Offer is already ${serviceListItem.status}`)

    serviceListItem.offerBy = offerBy
    serviceListItem.planSelected.price = newOfferPrice
    await event.save()

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Status Updated Successfully",
    })
}

export const offerAVendor = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const {
        vendorProfileId,
        subEventIds,
        serviceId,
        selectedItemIds,
        estimatedGuestNos,
        offerPrices,
    } = req.body

    //check vendorProfileId is valid
    const vendorProfile = await VendorProfile.findById(vendorProfileId)
    if (!vendorProfile) throw new NotFoundError("Vendor Not Found")

    if (!serviceId) throw new BadRequestError("Service Id is required")

    if (
        vendorProfile.services.findIndex(
            (service) => service.toString() === serviceId.toString(),
        ) === -1
    )
        throw new BadRequestError("Vendor does not offer this service")

    //find service
    const service = await Services.findById(serviceId)
    if (!service) throw new NotFoundError("Service Not Found")

    //if subEventIds is not array throw error
    if (!Array.isArray(subEventIds))
        throw new BadRequestError("SubEventIds should be an array")

    const isValid = subEventIds.every((id: any) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid SubEvent Ids")

    const event = await Event.findById(eventId)
    if (!event) throw new NotFoundError("Event Not Found")

    subEventIds.forEach((subEventId) => {
        const subEvent = event.subEvents.find(
            (subEvent) => subEvent.toString() === subEventId.toString(),
        )
        if (!subEvent)
            throw new NotFoundError(`SubEvent ${subEventId} Not Found`)
    })

    subEventIds.forEach((subEventId, index) => {
        const selectedItem = service.items.find(
            (item) => item._id.toString() === selectedItemIds[index].toString(),
        )
        if (!selectedItem)
            throw new NotFoundError(`Item ${selectedItemIds[index]} Not Found`)
        event.serviceList.push({
            vendorProfile: vendorProfileId,
            subEvent: subEventId,
            estimatedGuests: estimatedGuestNos[index],
            servicesOffering: serviceId,
            planSelected: {
                _id: selectedItem._id,
                name: selectedItem.name,
                price: parseInt(offerPrices[index]),
                description: selectedItem.description,
            },
            offerBy: "user",
        })
    })

    await event.save()

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Offer Price Updated Successfully",
    })
}

export const addRemoveGuestsToSubEvent = async (
    req: Request,
    res: Response,
) => {
    const { eventId, subEventId } = req.params
    const { guestIds } = req.body

    console.log(eventId, subEventId, guestIds)

    const event = await Event.findById(eventId)
    if (!event) throw new NotFoundError("Event Not Found")

    //check all guestIds are valid
    const isValid = guestIds.every((id: any) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid Guest Ids")

    event.userList
        .filter((user) => guestIds.includes(user.user.toString()))
        .forEach((user) => {
            const alreadyExist = user.subEvents.findIndex(
                (subEvent) => subEvent.toString() === subEventId,
            )
            if (alreadyExist === -1) {
                //@ts-ignore
                user.subEvents.push(new Types.ObjectId(subEventId))
            } else {
                user.subEvents.splice(alreadyExist, 1)
            }
            user.status = "pending"
        })

    await event.save()
    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Guests Updated Successfully",
    })
}

export const updateBudget = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { budget } = req.body

    const event = await Event.findByIdAndUpdate(eventId, {
        budget,
    })

    if (!event) throw new NotFoundError("Event Not Found")

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Budget Updated Successfully",
    })
}

export const acceptRejectInviteGuest = async (req: Request, res: Response) => {
    const { token, status, expectedGuest } = req.body
    console.log(token)

    let invitationsPayload: InvitationTokenPayload

    if (token) {
        invitationsPayload = jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
        ) as InvitationTokenPayload

        console.log(invitationsPayload)
    } else {
        invitationsPayload = req.body
    }

    const event = await Event.findById(invitationsPayload.eventId)
    if (!event) throw new NotFoundError("Event Not Found")

    const userIndex = event.userList.findIndex(
        (user) => user._id.toString() === invitationsPayload.userListId,
    )
    if (userIndex === -1)
        throw new NotFoundError("User is Not Part Of This Event")
    event.userList[userIndex].status = status
    event.userList[userIndex].expectedGuests = parseInt(expectedGuest) || 1
    await event.save()

    res.status(StatusCodes.OK).json({
        data: {},
        success: true,
        msg: "Invitation Updated Successfully",
    })
}

export const getUserEventDetails = async (req: Request, res: Response) => {
    const { token } = req.body

    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as jwt.Secret,
    ) as InvitationTokenPayload

    const event = await Event.findById(payload.eventId)
        .select("name host startDate endDate userList")
        .populate({
            path: "host",
            select: "name profileImage email phoneNo",
        })
        .populate({
            path: "userList.subEvents",
            select: "name startDate endDate venue",
        })

    if (!event) throw new NotFoundError("Event Not Found")

    console.log(event.userList.map((user) => user._id.toString()))
    console.log(payload.userListId)

    const eventData = {
        ...event.toJSON(),
        userList: event.userList.find(
            (user) => payload.userListId === user._id.toString(),
        ),
    }
    if (eventData.userList === undefined)
        throw new UnauthenticatedError("User Not Found")

    res.status(StatusCodes.OK).json({
        data: eventData,
        success: true,
        msg: "Events Fetched Successfully",
    })
}

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const { eventId, serviceListId } = req.params
    const { status } = req.body

    const validStatus = ["pending", "paid", "failed"]
    if (!validStatus.includes(status))
        throw new BadRequestError(
            `Status must be one of ${validStatus.join(",")}`,
        )

    const event = await Event.findByIdAndUpdate(
        eventId,
        {
            $set: { "serviceList.$[elem].paymentStatus": status },
        },
        {
            arrayFilters: [{ "elem._id": serviceListId }],
            new: true,
        },
    )

    if (!event) throw new NotFoundError("Event not found")

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Payment Status Updated Successfully",
    })
}
