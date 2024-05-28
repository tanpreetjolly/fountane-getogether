import { Router } from "express"
import TaskRouter from "./task"
import {
    createEvent,
    createSubEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    createSubEventChannel,
} from "../controllers/event"

import Protect from "../middleware/permissionRequired"
// import { Permissions } from "../values"

const router = Router()

router.use("/task", TaskRouter)

router.route("/").post(createEvent)

router.route("/:eventId").get(getEvent).delete(deleteEvent).patch(updateEvent)
router.route("/:eventId/subEvent").post(createSubEvent)
router
    .route("/:eventId/subEvent/:subEventId/channel")
    .post(createSubEventChannel)

// router.use(Protect(Permissions.HOST))

export default router
