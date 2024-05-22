import { Router } from "express"
import {
    getTasks,
    getTask,
    createTasks,
    updateTasks,
    deleteTasks,
} from "../controllers/task"
import Protect from "../middleware/permissionRequired"
import Permissions from "../permissions"

const router = Router()

router.use(Protect(Permissions.VIEW_TASK))

router
    .route("/")
    .get(getTasks)
    .post(Protect(Permissions.EDIT_TASK), createTasks)
router.route("/:taskId").get(getTask)

router.use(Protect(Permissions.EDIT_TASK))
router.route("/:taskId").put(updateTasks).delete(deleteTasks)

export default router
