import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Event, SubEvent } from "../models"
import { populate } from "dotenv"

const getEvent = async (req: Request, res: Response) => {
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

const createSubEvent = async (req: Request, res: Response) => {
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
        data: subEvent,
        success: true,
        msg: "Sub Event Created Successfully",
    })
}

export { getEvent }
