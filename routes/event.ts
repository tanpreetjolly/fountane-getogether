import { NextFunction, Request, Response, Router } from "express"
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
import { Event } from "../models"

const router = Router()

router.route("/").post(createEvent)
router.route("/:eventId").get(getEvent)

router.route("/:eventId/guest/invite/accept-reject").post(acceptRejectInvite)

const logEventId = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId
    const event = await Event.findById(eventId).select("host")
    if (!event || event.host.toString() !== req.user.userId)
        return res.status(403).send({
            success: false,
            msg: "You are not the Host.",
        })
    next()
}

// Create a new router for routes that require :eventId
const eventRouter = Router({ mergeParams: true })

eventRouter.use(logEventId)

eventRouter.route("/").delete(deleteEvent).patch(updateEvent)
eventRouter.route("/budget").patch(updateBudget)

eventRouter.route("/guest/invite").post(inviteGuest)
eventRouter.route("/guest/invite/new").post(inviteNewGuest)

eventRouter.route("/vendor/offer").post(offerAVendor)

eventRouter.route("/task").get(getTasks).post(createTasks)
eventRouter.route("/task/:taskId").get(getTask)
eventRouter.route("/task/:taskId").put(updateTasks).delete(deleteTasks)

eventRouter.route("/subEvent").post(createSubEvent)
eventRouter
    .route("/subEvent/:subEventId/guest/invite/add-remove")
    .post(addRemoveGuestsToSubEvent)
eventRouter.route("/subEvent/:subEventId/channel").post(createSubEventChannel)

router.use("/:eventId", eventRouter)

export default router
