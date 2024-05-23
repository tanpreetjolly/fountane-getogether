import { Router } from "express"
import TaskRouter from "./task"
import { getEvent } from "../controllers/event"

import Protect from "../middleware/permissionRequired"
import Permissions from "../permissions"

const router = Router()

router.use("/task", TaskRouter)

router.route("/:eventId").get(getEvent)

// router.use(Protect(Permissions.HOST))

export default router
