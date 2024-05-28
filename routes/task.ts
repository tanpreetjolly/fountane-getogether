import { Router } from "express"
import {
    getTasks,
    getTask,
    createTasks,
    updateTasks,
    deleteTasks,
} from "../controllers/task"
import Protect from "../middleware/permissionRequired"
import { PERMISSIONS } from "../values"

const router = Router()

router.use(Protect(PERMISSIONS.VIEW_TASK))

router
    .route("/")
    .get(getTasks)
    .post(Protect(PERMISSIONS.EDIT_TASK), createTasks)
router.route("/:taskId").get(getTask)

router.use(Protect(PERMISSIONS.EDIT_TASK))
router.route("/:taskId").put(updateTasks).delete(deleteTasks)

export default router
