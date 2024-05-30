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
import { faker } from "@faker-js/faker"

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
        allUserListId.add(vendor.vendorProfile)
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
            name: faker.person.fullName(),
            email: "hello@hello.com",
            profileImage: faker.image.avatar(),
            phoneNo: faker.string.numeric(10),
            password: "hello@hello.com",
            status: "active",
            vendorProfile: null,
        })

        const hashedPassword = await bcrypt.hash("password", 10)

        const manyUser = Array.from({ length: 10 }, (_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            name: faker.person.fullName(),
            email: `user${i}@example.com`,
            profileImage: faker.image.avatar(),
            phoneNo: faker.string.numeric(10),
            password: hashedPassword,
            status: "active",
        }))

        await User.insertMany(manyUser)

        const vendorUsers = manyUser.slice(0, 4)
        const guestUsers = manyUser.slice(4)

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
                services: Array.from({ length: 2 }, () => ({
                    //random service from sampleService
                    serviceName:
                        sampleService[
                            Math.floor(Math.random() * sampleService.length)
                        ],
                    serviceDescription: faker.lorem.sentence(),
                    price: faker.finance.amount(),
                })),
            })),
        ]

        // Create a vendor profile for the user
        const vendorProfile = await VendorProfile.create({
            user: user._id,
            services: [
                {
                    serviceName: "Photographer",
                    serviceDescription:
                        "We provide the best photography services! for weddings, birthdays, and other events.",
                    price: faker.finance.amount(),
                },
                {
                    serviceName: "Caterer",
                    serviceDescription:
                        "We provide the best catering services!",
                    price: faker.finance.amount(),
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
                name: "Pre-Wedding",
                startDate: new Date("2024-05-24T09:00:00Z"),
                endDate: new Date("2024-05-24T13:00:00Z"),
                venue: "Miami Cafe, Delhi",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Wedding Day",
                startDate: new Date("2024-05-25T09:00:00Z"),
                endDate: new Date("2024-05-26T13:00:00Z"),
                venue: "Taj Hotel, Mumbai",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Reception and Dinner",
                startDate: new Date("2024-05-27T09:00:00Z"),
                endDate: new Date("2024-05-27T13:00:00Z"),
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
            name: "Rakesh weds Ritu",
            host: user._id,
            startDate: new Date("2024-05-24T09:00:00Z"),
            endDate: new Date("2024-05-27T13:00:00Z"),
            budget: 100000,
            eventType: "wedding",
            userList: [
                ...guestUsers.map((user) => ({
                    user: user._id,
                    subEvents: assignRandomSubEvents(subEventToCreate),
                })),
            ],
            vendorList: [
                ...vendorUsers.map((user) => ({
                    vendorProfile:
                        vendorProfileToCreate[
                            Math.floor(
                                Math.random() * vendorProfileToCreate.length,
                            )
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
            name: "Photo Sharing",
            allowedUsers: [user._id],
        })

        // Create a chat message in the channel
        await ChatMessage.create({
            userId: user._id,
            channelId: channel._id,
            message: "Hello, world!",
        })

        subEventToCreate[1].channels.push(channel._id)

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
