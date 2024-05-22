import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { BadRequestError } from "../errors"
import setEventTokenCookie from "../utils/setCookie/setEventToken"
import Event from "../models/event"
import { EventPayload } from "../types/express"

const permissionRequired = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const eventId = req.params.eventId
        if (!eventId)
            throw new BadRequestError(
                "Internal Server Error.Please Contact Admin",
            )

        let eventToken = req.cookies[`event:${eventId}`]
        if (eventToken) {
            const event = await Event.findById(eventId)
            if (!event)
                throw new BadRequestError(`Event not found with id ${eventId}`)
            eventToken = setEventTokenCookie(res, req.user.userId, event)
        }

        const eventPayload = jwt.verify(
            eventToken,
            process.env.JWT_SECRET as jwt.Secret,
        ) as EventPayload

        // Type assertion to convert req object to Request
        ;(req as Request).event = eventPayload
        next()
    }
}

export default permissionRequired
