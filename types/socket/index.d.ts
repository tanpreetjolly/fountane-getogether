// types/socket.d.ts
import { SocketTokenPayload } from "../express"
import { Socket } from "socket.io"

declare module "socket.io" {
    interface Socket {
        user: SocketTokenPayload
    }
}
