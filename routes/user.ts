import { Router } from "express"
import upload from "../utils/imageHandlers/multer"
import {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    makeMeVendor,
    getChatMessages,
    getChannelMessages,
    uploadImage,
} from "../controllers/user"

const router = Router()

router.route("/me").get(getMe)
router.patch("/make-me-vendor", makeMeVendor)
router.patch("/update-profile", updateCompleteProfile)
router
    .route("/image")
    .post(upload.single("profileImage"), updateProfileImage)
    .delete(deleteProfileImage)
router.get("/chats/:chatId/messages", getChatMessages)
router.get("/channels/:channelId/messages", getChannelMessages)
router.post("/upload/image", upload.single("image"), uploadImage)

export default router
