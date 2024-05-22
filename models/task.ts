import { Schema, model } from "mongoose"
import { ITask } from "../types/models"

const TaskSchema = new Schema<ITask>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Please Provide Event ID"],
        },
        name: {
            type: String,
            required: [true, "Must Provide Name"],
            trim: true,
            maxlength: [500, "Name can not exceed 50 characters"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

TaskSchema.index({ eventId: 1 })

const Task = model<ITask>("Task", TaskSchema)
export default Task
