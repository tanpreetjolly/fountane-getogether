import { Response, Request } from "express"
import mongoose from "mongoose"

export interface UserPayload {
    userId: string
    vendorProfile: string | null
}

export interface SocketTokenPayload {
    userId: string
    vendorProfile: string | null
}

declare global {
    namespace Express {
        export interface Request {
            user: UserPayload
            event?: EventPayload
            file: any
            pagination: {
                skip: number
                limit: number
                page: number
            }
        }
    }
}
