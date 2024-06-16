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
    acceptRejectInvite,
    offerAVendor,
    addRemoveGuestsToSubEvent,
    updateBudget,
} from "../controllers/event"
import {
    getTasks,
    getTask,
    createTasks,
    updateTasks,
    deleteTasks,
} from "../controllers/task"

// import Protect from "../middleware/permissionRequired"
// import { Permissions } from "../values"

const router = Router()

router.route("/").post(createEvent)

router.route("/:eventId").get(getEvent).delete(deleteEvent).patch(updateEvent)
router.route("/:eventId/budget").patch(updateBudget)

router.route("/:eventId/guest/invite").post(inviteGuest)
router.route("/:eventId/guest/invite/accept-reject").post(acceptRejectInvite)
router.route("/:eventId/guest/invite/new").post(inviteNewGuest)

router.route("/:eventId/vendor/offer").post(offerAVendor)

router.route("/:eventId/task").get(getTasks).post(createTasks)
router.route("/:eventId/task/:taskId").get(getTask)
router.route("/:eventId/task/:taskId").put(updateTasks).delete(deleteTasks)

router.route("/:eventId/subEvent").post(createSubEvent)

router
    .route("/:eventId/subEvent/:subEventId/guest/invite/add-remove")
    .post(addRemoveGuestsToSubEvent)
router
    .route("/:eventId/subEvent/:subEventId/channel")
    .post(createSubEventChannel)

// router.use(Protect(Permissions.HOST))

export default router
