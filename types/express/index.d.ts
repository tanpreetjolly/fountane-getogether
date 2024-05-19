import { Response, Request } from "express"
import mongoose from "mongoose"

export interface TempUserPayload {
    userId: string
    isVendor: boolean
}

export interface UserPayload {
    userId: mongoose.Types.ObjectId
    isVendor: boolean
}

declare global {
    namespace Express {
        export interface Request {
            user: UserPayload
            file: any
            pagination: {
                skip: number
                limit: number
                page: number
            }
        }
    }
}
