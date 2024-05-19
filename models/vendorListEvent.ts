import { Schema, model } from "mongoose"
import { IVendorListEvent, IPayment } from "../types/models"

const PaymentSchema = new Schema<IPayment>(
    {
        amount: {
            type: Number,
            required: [true, "Please Provide Amount."],
        },
        status: {
            type: String,
            required: [true, "Please Provide Status."],
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
    },
    { timestamps: true },
)

const VendorListEventSchema = new Schema<IVendorListEvent>({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "VendorProfile",
        required: true,
    },
    subEvents: { type: Schema.Types.ObjectId, ref: "SubEvent", required: true },
    status: {
        type: String,
        enum: ["accepted", "rejected", "pending"],
        default: "pending",
    },
    serviceOffering: { type: String, required: true },
    paymentStatus: { type: PaymentSchema, required: true },
}, { timestamps: true })

VendorListEventSchema.index({ vendorId: 1 })

const VendorListEvent = model<IVendorListEvent>(
    "VendorListEvent",
    VendorListEventSchema,
)
export default VendorListEvent
