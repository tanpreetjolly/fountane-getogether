import { Router } from "express"
import upload from "../utils/imageHandlers/multer"
import {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
} from "../controllers/user"
// import userBlogRouter from "./userBlog"

const router = Router()

router.route("/me").get(getMe)
// router.use("/blog", userBlogRouter)
router.patch("/update-profile", updateCompleteProfile)
router
    .route("/image")
    .post(upload.single("profileImage"), updateProfileImage)
    .delete(deleteProfileImage)

export default router
