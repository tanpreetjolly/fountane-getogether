import { Router } from "express"
import AuthMiddleware from "../middleware/auth"
import AuthRouter from "./auth"
// import BlogPublicRouter from "./blogPublic"
// import BlogUpdateRouter from "./blogUpdate"
import UserRouter from "./user"
import SearchRouter from "./search"
// import ProfileRouter from "./profile"
import TaskRouter from "./task"

const router = Router()

router.use("/auth", AuthRouter)

router.use("/public/search", SearchRouter)
// router.use("/public/profile", ProfileRouter)
// router.use("/public/blog", BlogPublicRouter)

router.use(AuthMiddleware)

router.use("/user", UserRouter)
// router.use("/blog", BlogUpdateRouter)

//Behind a middleware that ensure that only host can access
router.use("/task/:eventId", TaskRouter)

export default router
