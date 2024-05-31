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
    price: { type: Number, required: [true, "Price is required."] },
})

const Services = model<IServices>("Services", ServicesSchema)
export default Services
