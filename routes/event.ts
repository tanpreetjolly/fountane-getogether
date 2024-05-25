import { Router } from "express"
import TaskRouter from "./task"
import { createEvent, createSubEvent, getEvent } from "../controllers/event"

import Protect from "../middleware/permissionRequired"
import Permissions from "../permissions"

const router = Router()

router.use("/task", TaskRouter)

router.route("/:eventId").get(getEvent).post(createEvent)

router.use(Protect(Permissions.HOST))

router.route("/:eventId/subevent").post(createSubEvent)

export default router
