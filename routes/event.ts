import { Router } from "express"
import TaskRouter from "./task"
import {
    createEvent,
    createSubEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    createSubEventChannel,
    inviteGuest,
    inviteNewGuest,
} from "../controllers/event"

// import Protect from "../middleware/permissionRequired"
// import { Permissions } from "../values"

const router = Router()

router.route("/").post(createEvent)

router.route("/:eventId").get(getEvent).delete(deleteEvent).patch(updateEvent)

router.use("/:eventId/guest/invite", inviteGuest)
router.use("/:eventId/guest/invite/new", inviteNewGuest)
router.use("/:eventId/task", TaskRouter)

router.route("/:eventId/subEvent").post(createSubEvent)

router
    .route("/:eventId/subEvent/:subEventId/channel")
    .post(createSubEventChannel)

// router.use(Protect(Permissions.HOST))

export default router
