import { createService, updateService } from "../controllers/vendor"
import { Router } from "express"
const router = Router()

router.route("/:vendorId/service").post(createService)
router.route("/:vendorId/service/:serviceId").put(updateService)

export default router
