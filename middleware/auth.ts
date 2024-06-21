import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { UnauthenticatedError } from "../errors"
import { UserPayload } from "../types/express"

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies?.token
    if (!token) throw new UnauthenticatedError("Token not found")

    const userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET as jwt.Secret,
    ) as UserPayload
    // Type assertion to convert req object to Request
    ;(req as Request).user = userPayload
    next()
}

export default authenticate
