import { Router } from "express"
import TaskRouter from "./task"
import { createEvent, createSubEvent, getEvent } from "../controllers/event"

import Protect from "../middleware/permissionRequired"
import Permissions from "../permissions"

const router = Router()

router.use("/task", TaskRouter)

router.route("/").post(createEvent)

router.route("/:eventId").get(getEvent)
router.route("/:eventId/subEvent").post(createSubEvent)

// router.use(Protect(Permissions.HOST))


export default router
