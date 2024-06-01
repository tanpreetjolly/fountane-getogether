import { Router } from "express"
import AuthMiddleware from "../middleware/auth"
import AuthRouter from "./auth"
import UserRouter from "./user"
import SearchRouter from "./search"
import EventRouter from "./event"
import VendorRouter from "./vendor"

const router = Router()

router.use("/auth", AuthRouter)

router.use("/public/search", SearchRouter)

router.use(AuthMiddleware)

router.use("/user", UserRouter)
router.use("/event", EventRouter)
router.use("/vendor", VendorRouter)

export default router
