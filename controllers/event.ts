import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Event, SubEvent } from "../models"
import { StatusCodes } from "http-status-codes"

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

const createEvent = async (req: Request, res: Response) => {
    const { name, startDate, endDate, budget } = req.body
    const host = req.user

    console.log(host)

    const createEvent = await Event.create({
        name,
        startDate,
        endDate,
        budget,
        host: host.userId,
    })

    const event = await Event.findById(createEvent._id)
        .select("name startDate endDate host")
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

export { getEvent, createEvent, createSubEvent }
