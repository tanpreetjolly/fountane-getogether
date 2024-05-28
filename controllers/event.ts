import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Channel, Event, SubEvent } from "../models"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"
import { PERMISSIONS, CHANNEL_TYPES, ROLES } from "../values"

export const getEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params

    const event = await Event.findById(eventId).populate([
        {
            path: "host",
            select: "name profileImage",
        },
        {
            path: "userList",
            populate: {
                path: "user",
                select: "name email phoneNo profileImage",
            },
        },
        {
            path: "subEvents",
            populate: {
                path: "channels",
                populate: {
                    path: "allowedUsers",
                    select: "name email phoneNo profileImage",
                },
            },
        },
    ])

    if (!event) throw new NotFoundError("Event Not Found")
    res.status(200).json({
        data: event,
        success: true,
        msg: "Event Fetched Successfully",
    })
}

export const createEvent = async (req: Request, res: Response) => {
    const { name, startDate, endDate, budget, eventType } = req.body
    const host = req.user

    console.log(host)

    const createEvent = await Event.create({
        name,
        startDate,
        endDate,
        budget,
        host: host.userId,
        eventType,
    })

    const event = await Event.findById(createEvent._id)
        .select("name startDate endDate host eventType budget")
        .populate({
            path: "host",
            select: "name profileImage",
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

    const event = await Event.findById(eventId)

    if (!event) throw new NotFoundError("Event Not Found")

    const subEvent = await SubEvent.create({
        name,
        startDate,
        endDate,
        venue,
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
    const allowedUsersSet = Array.from(new Set(allowedUsers))
    //check all allowed users are mongoose object id
    const isValid = allowedUsersSet.every((id) =>
        Types.ObjectId.isValid(id as string),
    )
    if (!isValid) throw new BadRequestError("Invalid User Ids")
    const channel = await Channel.create({
        name,
        allowedUsers: allowedUsersSet,
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
