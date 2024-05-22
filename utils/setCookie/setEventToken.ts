import { Response } from "express"
import { IUser, IEvent } from "../../types/models"
const setEventTokenCookie = (
    res: Response,
    userId: IUser["_id"],
    event: IEvent,
) => {
    //refresh token
    const token = event.generateToken(userId)

    res.cookie("eventToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(
            Date.now() +
                parseInt(process.env.JWT_LIFETIME as string) *
                    1000 *
                    24 *
                    60 *
                    60,
        ),
    })
}
export default setEventTokenCookie
