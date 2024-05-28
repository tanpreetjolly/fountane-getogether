import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Event, SubEvent } from "../models"
import { StatusCodes } from "http-status-codes"

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
