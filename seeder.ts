import mongoose from "mongoose"
import {
    User,
    Channel,
    ChatMessage,
    Event,
    SubEvent,
    VendorProfile,
    Task,
} from "./models"
import connectDB from "./db/connect"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { CHANNEL_TYPES, ROLES } from "./values"
import { IEvent } from "./types/models"

dotenv.config()

const createChannelsForSubEvents = async (
    userList: IEvent["userList"][0][],
    vendorList: IEvent["vendorList"][0][],
) => {
    const allUserListId = new Set()
    userList.forEach((user) => {
        allUserListId.add(user.user)
    })
    vendorList.forEach((vendor) => {
        allUserListId.add(vendor.vendor)
    })

    const newSubEventChannels = [
        {
            name: "Announcement",
            allowedUsers: Array.from(allUserListId),
            type: CHANNEL_TYPES.MAIN,
        },
        {
            name: "Vendors Only",
            allowedUsers: userList.map((user) => user.user),
            type: CHANNEL_TYPES.MAIN,
        },
        {
            name: "Guests Only",
            allowedUsers: userList.map((user) => user.user),
            type: CHANNEL_TYPES.MAIN,
        },
    ]
    const newChannels = await Channel.insertMany(newSubEventChannels)
    return newChannels.map((channel) => channel._id)
}

// Connect to the database and drop the existing data
async function main() {
    try {
        await connectDB(process.env.MONGO_URL as string)

        await User.deleteMany({})
        await VendorProfile.deleteMany({})
        await Event.deleteMany({})
        await SubEvent.deleteMany({})
        await ChatMessage.deleteMany({})
        await Channel.deleteMany({})

        // Create a new user
        const user = await User.create({
            _id: "60f1b9e3b3f1f3b3b3f1f3b3",
            name: "John Doe",
            email: "hello@hello.com",
            phoneNo: "1234567890",
            password: "hello@hello.com",
            status: "active",
            vendorProfile: null,
        })

        const hashedPassword = await bcrypt.hash("password", 10)

        const manyUser = Array.from({ length: 10 }, (_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            name: `John Doe ${i}`,
            email: `user${i}@example.com`,
            phoneNo: Math.floor(
                1000000000 + Math.random() * 9000000000,
            ).toString(),
            password: hashedPassword,
            status: "active",
        }))

        await User.insertMany(manyUser)

        //select some random users to be vendors
        const vendorUsers = manyUser.slice(0, 4)

        const sampleService = [
            "Photography",
            "Catering",
            "Decoration",
            "Music",
            "Transportation",
            "Venue",
            "Entertainment",
        ]

        const vendorProfileToCreate = [
            ...vendorUsers.map((user) => ({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
                services: [
                    {
                        //random service from sampleService
                        serviceName:
                            sampleService[
                                Math.floor(Math.random() * sampleService.length)
                            ],
                        serviceDescription: "Description of service 1",
                        price: 100,
                    },
                    {
                        serviceName:
                            sampleService[
                                Math.floor(Math.random() * sampleService.length)
                            ],
                        serviceDescription: "Description of service 2",
                        price: 200,
                    },
                ],
            })),
        ]

        // Create a vendor profile for the user
        const vendorProfile = await VendorProfile.create({
            user: user._id,
            services: [
                {
                    serviceName: "Service 1",
                    serviceDescription: "Description of service 1",
                    price: 100,
                },
                {
                    serviceName: "Service 2",
                    serviceDescription: "Description of service 2",
                    price: 200,
                },
            ],
        })

        // Update the user with the vendor profile
        await User.findByIdAndUpdate(user._id, {
            vendorProfile: vendorProfile._id,
        })

        await VendorProfile.insertMany(vendorProfileToCreate)

        let subEventToCreate = [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Sub Event 1",
                startDate: new Date("2023-01-01T09:00:00Z"),
                endDate: new Date("2023-01-01T13:00:00Z"),
                venue: "Venue 1",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Sub Event 2",
                startDate: new Date("2023-01-02T09:00:00Z"),
                endDate: new Date("2023-01-02T13:00:00Z"),
                venue: "Venue 2",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Sub Event 3",
                startDate: new Date("2023-01-03T09:00:00Z"),
                endDate: new Date("2023-01-03T13:00:00Z"),
                venue: "Venue 3",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
        ]

        const assignRandomSubEvents = (subEvents: any[]) => {
            const randomSubEvents = new Set()
            const eventsToSelect = Math.max(
                Math.floor(Math.random() * subEvents.length),
                1,
            )
            while (randomSubEvents.size < eventsToSelect) {
                randomSubEvents.add(
                    subEvents[Math.floor(Math.random() * subEvents.length)]._id,
                )
            }
            return Array.from(randomSubEvents)
        }

        // Create an event for the user
        const event = await Event.create({
            name: "Event 1",
            host: user._id,
            startDate: new Date("2023-01-01T09:00:00Z"),
            endDate: new Date("2023-01-01T13:00:00Z"),
            budget: 1000,
            eventType: "wedding",
            userList: [
                ...manyUser.map((user) => ({
                    user: user._id,
                    // role: Math.random() > 0.5 ? ROLES.VENDOR : ROLES.GUEST,
                    subEvents: assignRandomSubEvents(subEventToCreate),
                })),
            ],
            vendorList: [
                ...manyUser.map((user) => ({
                    vendor: vendorProfileToCreate[
                        Math.floor(Math.random() * vendorProfileToCreate.length)
                    ]._id,
                    subEvents: assignRandomSubEvents(subEventToCreate).map(
                        (sId) => ({
                            subEvent: sId,
                            status: ["accepted", "rejected", "pending"][
                                Math.floor(Math.random() * 3)
                            ],
                            servicesOffering: sampleService.slice(
                                Math.floor(
                                    Math.random() * sampleService.length,
                                ),
                                Math.floor(
                                    Math.random() * sampleService.length,
                                ),
                            ),
                            amount: Math.floor(Math.random() * 1000),
                            paymentStatus: ["pending", "paid", "failed"][
                                Math.floor(Math.random() * 3)
                            ],
                        }),
                    ),
                })),
            ],
        })

        for (let i = 0; i < subEventToCreate.length; i++) {
            subEventToCreate[i].channels = await createChannelsForSubEvents(
                event.userList.filter((user) => {
                    const userSubEvents = user.subEvents.map((se) =>
                        se.toString(),
                    )
                    return userSubEvents.includes(
                        subEventToCreate[i]._id.toString(),
                    )
                }),
                event.vendorList.filter((vendor) => {
                    const vendorSubEvents = vendor.subEvents.map((se) =>
                        se.toString(),
                    )
                    return vendorSubEvents.includes(
                        subEventToCreate[i]._id.toString(),
                    )
                }),
            )
        }

        // Create a channel for the event
        const channel = await Channel.create({
            name: "Channel 1",
            allowedUsers: [user._id],
        })

        // Create a chat message in the channel
        await ChatMessage.create({
            userId: user._id,
            channelId: channel._id,
            message: "Hello, world!",
        })

        // Create a sub-event for the event
        const subEvent = await SubEvent.insertMany(subEventToCreate)

        // Add the sub-event to the event
        await Event.findByIdAndUpdate(
            event._id,
            {
                $push: {
                    subEvents: {
                        $each: subEvent.map((se) => se._id),
                    },
                },
            },
            {
                runValidators: true,
            },
        )

        console.log("Dummy data has been successfully created!")
        mongoose.connection.close()
    } catch (err) {
        console.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
}

main()
