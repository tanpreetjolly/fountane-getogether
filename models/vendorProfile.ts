import { Schema, model } from "mongoose"
import { IVendorProfile } from "../types/models"

const VendorProfileSchema = new Schema<IVendorProfile>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required."],
        },
        services: {
            type: [Schema.Types.ObjectId],
            ref: "Services",
        },
    },
    { timestamps: true },
)

const VendorProfile = model<IVendorProfile>(
    "VendorProfile",
    VendorProfileSchema,
)
export default VendorProfile
