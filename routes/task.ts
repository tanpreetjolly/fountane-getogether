import { Router } from "express"
import {
    getTasks,
    getTask,
    createTasks,
    updateTasks,
    deleteTasks,
} from "../controllers/task"

const router = Router()

router.route("/").get(getTasks).post(createTasks)
router.route("/:taskId").get(getTask)

router.route("/:taskId").put(updateTasks).delete(deleteTasks)

export default router
