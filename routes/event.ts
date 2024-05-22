import { Router } from "express"
import TaskRouter from "./task"

const router = Router()

router.use("/task", TaskRouter)

export default router
