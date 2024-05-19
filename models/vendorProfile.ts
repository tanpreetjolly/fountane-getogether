import { Schema, model } from "mongoose"
import { IVendorProfile } from "../types/models"

const VendorProfileSchema = new Schema<IVendorProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required."],
        },
        services: [
            {
                serviceName: {
                    type: String,
                    required: [true, "Service Name is required."],
                },
                serviceDescription: {
                    type: String,
                    required: [true, "Service Description is required."],
                },
                price: { type: Number, required: [true, "Price is required."] },
            },
        ],
    },
    { timestamps: true },
)

const VendorProfile = model<IVendorProfile>(
    "VendorProfile",
    VendorProfileSchema,
)
export default VendorProfile
