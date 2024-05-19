import { Response } from "express"
import { IUser } from "../../types/models"
const setAuthTokenCookie = (res: Response, user: IUser) => {
    //refresh token
    const token = user.generateToken()

    res.cookie("token", token, {
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

    //to indicate frontend that user is logged in
    res.cookie("userId", user._id, {
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
export default setAuthTokenCookie
