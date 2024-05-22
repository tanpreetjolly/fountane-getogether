import { Schema, model } from "mongoose"
import { IGuestListEvent } from "../types/models"

const GuestListEventSchema = new Schema<IGuestListEvent>(
    {
        guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subEvent: {
            type: Schema.Types.ObjectId,
            ref: "SubEvent",
            required: true,
        },
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
        },
    },
    { timestamps: true },
)

GuestListEventSchema.index({ guestId: 1 })

const GuestListEvent = model<IGuestListEvent>(
    "GuestListEvent",
    GuestListEventSchema,
)
export default GuestListEvent
