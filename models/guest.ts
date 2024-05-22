import { Schema, model } from "mongoose"
import { IGuest } from "../types/models"

const GuestSchema = new Schema<IGuest>(
    {
        guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subEvent: [
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
            },
        ],
    },
    { timestamps: true },
)

GuestSchema.index({ guestId: 1 })

const Guest = model<IGuest>("Guest", GuestSchema)
export default Guest
