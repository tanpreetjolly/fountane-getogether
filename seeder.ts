import mongoose from "mongoose"
import {
    User,
    Channel,
    ChatMessage,
    Event,
    SubEvent,
    VendorProfile,
    Task,
    Services,
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

const createVendorServices = async () => {
    const sampleService = [
        {
            serviceName: "Photographer",
            serviceDescription:
                "We provide the best photography services! for weddings, birthdays, and other events.",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Caterer",
            serviceDescription: "We provide the best catering services!",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Decorator",
            serviceDescription: "We provide the best decoration services!",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Music",
            serviceDescription: "We provide the best music services!",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Transportation",
            serviceDescription: "We provide the best transportation services!",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Venue",
            serviceDescription: "We provide the best venue services!",
            price: faker.finance.amount(),
        },
        {
            serviceName: "Entertainment",
            serviceDescription: "We provide the best entertainment services!",
            price: faker.finance.amount(),
        },
    ]
    const newChannels = await Services.insertMany(sampleService)
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

        // Create a vendor profile for the user
        const vendorProfile = await VendorProfile.create({
            user: "60f1b9e3b3f1f3b3b3f1f3b3",
            services: await createVendorServices(),
        })

        // Create a new user
        const user = await User.create({
            _id: "60f1b9e3b3f1f3b3b3f1f3b3",
            name: faker.person.fullName(),
            email: "hello@hello.com",
            profileImage: faker.image.avatar(),
            phoneNo: faker.string.numeric(10),
            password: "hello@hello.com",
            status: "active",
            vendorProfile: vendorProfile._id,
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
            vendorProfile: null as any,
        }))

        manyUser.slice(0, 4).forEach((user) => {
            user.vendorProfile = vendorProfile._id
        })
        const guestUsers = manyUser.slice(4)

        const vendorProfileToCreatePromise = [
            ...manyUser
                .filter((user) => user.vendorProfile)
                .map(async (user) => ({
                    _id: new mongoose.Types.ObjectId(),
                    user: user._id,
                    services: await createVendorServices(),
                })),
        ]
        const vendorProfileToCreate = await Promise.all(
            vendorProfileToCreatePromise,
        )
        await User.insertMany(manyUser)

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
                venue: "Leela Palace, Bangalore",
                channels: [] as mongoose.Schema.Types.ObjectId[],
            },
        ]

        let inviteSubEventToCreate = [
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
                venue: "Leela Palace, Bangalore",
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
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvents: assignRandomSubEvents(subEventToCreate).map(
                        (sId) => ({
                            subEvent: sId,
                            status: ["accepted", "rejected", "pending"][
                                Math.floor(Math.random() * 3)
                            ],
                            servicesOffering:
                                vendorUser.services[
                                    Math.floor(
                                        Math.random() *
                                            vendorUser.services.length,
                                    )
                                ],
                            amount: Math.floor(Math.random() * 1000),
                            paymentStatus: ["pending", "paid", "failed"][
                                Math.floor(Math.random() * 3)
                            ],
                        }),
                    ),
                })),
            ],
        })

        const inviteEvent = await Event.create({
            name: "Sam weds Riya",
            host: guestUsers[0]._id,
            startDate: new Date("2024-06-14T09:00:00Z"),
            endDate: new Date("2024-06-17T13:00:00Z"),
            budget: 900000,
            eventType: "wedding",
            userList: [
                {
                    user: user._id,
                    subEvents: assignRandomSubEvents(inviteSubEventToCreate),
                },
                ...guestUsers.map((user) => ({
                    user: user._id,
                    subEvents: assignRandomSubEvents(inviteSubEventToCreate),
                })),
            ],
            vendorList: [
                {
                    vendorProfile: user.vendorProfile,
                    subEvents: assignRandomSubEvents(
                        inviteSubEventToCreate,
                    ).map((sId) => ({
                        subEvent: sId,
                        status: ["accepted", "rejected", "pending"][
                            Math.floor(Math.random() * 3)
                        ],
                        //select any one service vendor is offering
                        servicesOffering:
                            vendorProfile.services[
                                Math.floor(
                                    Math.random() *
                                        vendorProfile.services.length,
                                )
                            ],
                        amount: Math.floor(Math.random() * 1000),
                        paymentStatus: ["pending", "paid", "failed"][
                            Math.floor(Math.random() * 3)
                        ],
                    })),
                },
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvents: assignRandomSubEvents(subEventToCreate).map(
                        (sId) => ({
                            subEvent: sId,
                            status: ["accepted", "rejected", "pending"][
                                Math.floor(Math.random() * 3)
                            ],
                            servicesOffering:
                                vendorUser.services[
                                    Math.floor(
                                        Math.random() *
                                            vendorUser.services.length,
                                    )
                                ]._id,
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
            inviteSubEventToCreate[i].channels =
                await createChannelsForSubEvents(
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

        // Create a sub-event for the event
        const inviteSubEvent = await SubEvent.insertMany(inviteSubEventToCreate)

        // Add the sub-event to the event
        await Event.findByIdAndUpdate(
            inviteEvent._id,
            {
                $push: {
                    subEvents: {
                        $each: inviteSubEvent.map((se) => se._id),
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
