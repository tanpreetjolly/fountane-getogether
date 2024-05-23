import Event from "../models/event"
import { Request, Response } from "express"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"

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
                select: "name allowedUsers",
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

export { getEvent }
