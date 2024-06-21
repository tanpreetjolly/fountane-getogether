import { Schema, model } from "mongoose"
import { IServices } from "../types/models"

const ServicesSchema = new Schema<IServices>({
    serviceName: {
        type: String,
        required: [true, "Service Name is required."],
    },
    serviceDescription: {
        type: String,
        required: [true, "Service Description is required."],
    },
    serviceImage: {
        type: String,
    },
    vendorProfileId: {
        type: Schema.Types.ObjectId,
        ref: "VendorProfile",
    },
    items: [
        {
            name: String,
            description: String,
            price: Number,
        },
    ],
})

const Services = model<IServices>("Services", ServicesSchema)
export default Services
