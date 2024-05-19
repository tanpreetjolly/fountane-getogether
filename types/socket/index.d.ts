// types/socket.d.ts
import { UserPayload } from "../express"
import { Socket } from "socket.io"

declare module "socket.io" {
    interface Socket {
        user: UserPayload
    }
}
