import { Schema, model, Types } from "mongoose"
import { IEvent, IUserList, IServiceList } from "../types/models"
import Channel from "./channel"
import SubEvent from "./subEvent"
import { CHANNEL_TYPES } from "../values"

const UserList = new Schema<IUserList>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide User."],
        },
        subEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubEvent",
            },
        ],
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
        },
        expectedGuests: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true },
)

UserList.index({ user: 1 })

const ServiceList = new Schema<IServiceList>(
    {
        vendorProfile: {
            type: Schema.Types.ObjectId,
            ref: "VendorProfile",
            required: [true, "Please Provide Vendor."],
        },
        subEvent: {
            type: Schema.Types.ObjectId,
            ref: "SubEvent",
            required: true,
        },
        estimatedGuests: {
            type: String,
            default: "NA",
        },
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
        },
        offerBy: {
            type: String,
            enum: ["vendor", "user"],
            default: "user",
        },
        servicesOffering: {
            type: Schema.Types.ObjectId,
            required: [true, "servicesOffering is required"],
            ref: "Services",
        },
        planSelected: {
            _id: Schema.Types.ObjectId,
            name: String,
            description: String,
            price: Number,
        },
        paymentStatus: {
            type: String,
            required: [true, "Please Provide Status."],
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true },
)

ServiceList.index({ vendorId: 1 })

const EventSchema = new Schema<IEvent>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
        },
        host: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide Host."],
        },
        startDate: {
            type: Date,
            required: [true, "Please Provide Start Date."],
        },
        endDate: {
            type: Date,
            required: [true, "Please Provide End Date."],
        },
        budget: {
            type: Number,
            required: [true, "Please Provide Budget."],
        },
        eventType: {
            type: String,
            required: [true, "Please Provide Event Type."],
            lowercase: true,
        },
        //this is embedded document
        userList: [UserList],
        serviceList: [ServiceList],
        //this is ref document
        subEvents: {
            type: [Schema.Types.ObjectId],
            ref: "SubEvent",
        },
    },
    { timestamps: true },
)

EventSchema.pre("save", async function (next) {
    // console.log(this.isModified("userList"), this.isModified("serviceList"))

    if (!this.isModified("userList") && !this.isModified("serviceList"))
        return next()

    const event = this
    const subEvents = event.subEvents
    for (let i = 0; i < subEvents.length; i++) {
        const subEvent = subEvents[i]
        const subEventDoc = await SubEvent.findById(subEvent)
        if (!subEventDoc) {
            event.subEvents.remove(subEvent)
            continue
        }
        const subEventUserList = event.userList
            .filter(
                (user) =>
                    user.subEvents.includes(subEvent) &&
                    user.status === "accepted",
            )
            .map((user) => user.user)

        const vendorList = Array.from(
            new Set(
                event.serviceList
                    .filter(
                        (service) =>
                            service.subEvent.toString() ===
                                subEvent.toString() &&
                            service.status === "accepted",
                    )
                    .map((service) => service.vendorProfile),
            ),
        )
        //find all channels of this subEvent
        const channels = await Channel.find({
            _id: { $in: subEventDoc.channels },
            type: { $not: { $eq: CHANNEL_TYPES.OTHER } },
        })
        for (let j = 0; j < channels.length; j++) {
            const channel = channels[j]
            switch (channel.type) {
                case CHANNEL_TYPES.ANNOUNCEMENT:
                    //@ts-ignore
                    channel.allowedUsers = subEventUserList.concat(vendorList)
                    break
                case CHANNEL_TYPES.VENDORS_ONLY:
                    //@ts-ignore
                    channel.allowedUsers = vendorList
                    break
                case CHANNEL_TYPES.GUESTS_ONLY:
                    //@ts-ignore
                    channel.allowedUsers = subEventUserList
                    break
            }
            //@ts-ignore
            channel.allowedUsers.addToSet(event.host._id)
            await channel.save()
        }
    }

    next()
})

const Event = model<IEvent>("Event", EventSchema)
export default Event
