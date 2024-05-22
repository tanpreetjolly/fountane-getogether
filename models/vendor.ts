import { Schema, model } from "mongoose"
import { IVendor, IPayment } from "../types/models"

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

const VendorSchema = new Schema<IVendor>(
    {
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "VendorProfile",
            required: true,
        },
        subEvents: [
            {
                subEventId: {
                    type: Schema.Types.ObjectId,
                    ref: "SubEvent",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["accepted", "rejected", "pending"],
                    default: "pending",
                },
                serviceOffering: { type: String, required: true },
                paymentStatus: { type: PaymentSchema, required: true },
            },
        ],
    },
    { timestamps: true },
)

VendorSchema.index({ vendorId: 1 })

const Vendor = model<IVendor>("Vendor", VendorSchema)
export default Vendor
