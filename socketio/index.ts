import { Server as HttpServer } from "http"
import { Server as SocketIOServer, ServerOptions } from "socket.io"
import { instrument } from "@socket.io/admin-ui"
import onConnection from "./socket-room"
import jwt from "jsonwebtoken"
import { SocketTokenPayload } from "../types/express"

export let io: SocketIOServer | null = null

export default (server: HttpServer, options: Partial<ServerOptions>) => {
    if (io) io.close()
    io = new SocketIOServer(server, options)
    if (process.env.NODE_ENV === "development")
        instrument(io, { auth: false, mode: "development" })

    io.use((socket, next) => {
        const { token } = socket.handshake.auth
        try {
            if (!token) return next(new Error("Token not found"))
            const userPayload = jwt.verify(
                token,
                process.env.JWT_SOCKET_SECRET as jwt.Secret,
            ) as SocketTokenPayload

            ;(socket as any).user = userPayload
        } catch (error) {
            return next(new Error("Invalid token"))
        }
        next()
    })

    io.on("connection", (socket) => onConnection(io, socket))
}
