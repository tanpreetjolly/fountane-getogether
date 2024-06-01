import { Request } from "express"
import { v2 as cloudinary } from "cloudinary"
import { v4 as uuidv4 } from "uuid"
cloudinary.config({
    cloud: process.env.CLOUDINARY_URL,
    secure: true,
})

// upload image to cloudinary and return the url
export const uploadProfileImage = async (req: Request) => {
    const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
            folder: `blogmind/${req.user.userId}`,
            public_id: "profile",
            overwrite: true,
            format: "webp",
            invalidate: true,
            width: 400,
            height: 400,
        },
    )
    return result.secure_url
}
export const deleteProfileImage = async (userId: string): Promise<boolean> => {
    const result = await cloudinary.uploader.destroy(
        `blogmind/${userId}/profile`,
        { invalidate: true },
        (error, result) => {
            if (error) return false
            if (result.result === "ok") return true
            return false
        },
    )
    return result
}
