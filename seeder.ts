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
import { CHANNEL_TYPES } from "./values"
import { IEvent } from "./types/models"
import { faker } from "@faker-js/faker"
import { generateChatId } from "./utils/utilFunctions"

dotenv.config()

const createChannelsForSubEvents = async (
    userList: IEvent["userList"][0][],
    serviceList: IEvent["serviceList"][0][],
) => {
    const allUserListId = new Set()
    userList.forEach((user) => {
        allUserListId.add(user.user)
    })
    serviceList.forEach((vendor) => {
        allUserListId.add(vendor.vendorProfile)
    })

    const newSubEventChannels = [
        {
            name: "Announcement",
            allowedUsers: Array.from(allUserListId),
            type: CHANNEL_TYPES.ANNOUNCEMENT,
        },
        {
            name: "Vendors Only",
            allowedUsers: serviceList.map((service) => service.vendorProfile),
            type: CHANNEL_TYPES.VENDORS_ONLY,
        },
        {
            name: "Guests Only",
            allowedUsers: userList.map((user) => user.user),
            type: CHANNEL_TYPES.GUESTS_ONLY,
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
            items: [
                {
                    name: "Wedding Photography",
                    description:
                        "We provide the best wedding photography services!",
                },
                {
                    name: "Birthday Photography",
                    description:
                        "We provide the best birthday photography services!",
                },
                {
                    name: "Event Photography",
                    description:
                        "We provide the best event photography services!",
                },
            ],
        },
        {
            serviceName: "Caterer",
            serviceDescription: "We provide the best catering services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "Punjabi Food",
                    description: "We provide the best food services!",
                },
                {
                    name: "South Indian Food",
                    description: "We provide the best food services!",
                },
                {
                    name: "Chinese Food",
                    description: "We provide the best food services!",
                },
                {
                    name: "Italian Food",
                    description: "We provide the best food services!",
                },
            ],
        },
        {
            serviceName: "Decorator",
            serviceDescription: "We provide the best decoration services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "Flower Decoration",
                    description:
                        "We provide the best flower decoration services!",
                },
                {
                    name: "Balloon Decoration",
                    description:
                        "We provide the best balloon decoration services!",
                },
                {
                    name: "Theme Decoration",
                    description:
                        "We provide the best theme decoration services!",
                },
                {
                    name: "Light Decoration",
                    description:
                        "We provide the best light decoration services!",
                },
            ],
        },
        {
            serviceName: "Music",
            serviceDescription: "We provide the best music services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "DJ",
                    description: "We provide the best DJ services!",
                },
                {
                    name: "Live Band",
                    description: "We provide the best live band services!",
                },
                {
                    name: "Singer",
                    description: "We provide the best singer services!",
                },
            ],
        },
        {
            serviceName: "Transportation",
            serviceDescription: "We provide the best transportation services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "Car",
                    description: "We provide the best car services!",
                },
                {
                    name: "Bus",
                    description: "We provide the best bus services!",
                },
                {
                    name: "Train",
                    description: "We provide the best train services!",
                },
                {
                    name: "Flight",
                    description: "We provide the best flight services!",
                },
            ],
        },
        {
            serviceName: "Venue",
            serviceDescription: "We provide the best venue services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "Hotel",
                    description: "We provide the best hotel services!",
                },
                {
                    name: "Banquet Hall",
                    description: "We provide the best banquet hall services!",
                },
                {
                    name: "Resort",
                    description: "We provide the best resort services!",
                },
                {
                    name: "Beach",
                    description: "We provide the best beach services!",
                },
            ],
        },
        {
            serviceName: "Entertainment",
            serviceDescription: "We provide the best entertainment services!",
            price: faker.finance.amount(),
            items: [
                {
                    name: "Magician",
                    description: "We provide the best magician services!",
                },
                {
                    name: "Clown",
                    description: "We provide the best clown services!",
                },
                {
                    name: "Dancer",
                    description: "We provide the best dancer services!",
                },
                {
                    name: "Comedian",
                    description: "We provide the best comedian services!",
                },
            ],
        },
    ]
    const newChannels = await Services.insertMany(sampleService)
    return newChannels.map((channel) => channel._id)
}

function getRandomElement(arr: any[]) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
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

        const mainUser = {
            _id: "60f1b9e3b3f1f3b3b3f1f3b3",
            name: faker.person.fullName(),
            email: "hello@hello.com",
            profileImage: faker.image.avatar(),
            phoneNo: faker.string.numeric(10),
            password: "hello@hello.com",
            status: "active",
            vendorProfile: vendorProfile._id,
            myChats: [] as mongoose.Types.ObjectId[],
        }

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
            myChats: [mainUser._id],
        }))

        manyUser.slice(0, 4).forEach((user) => {
            user.vendorProfile = vendorProfile._id
        })
        const guestUsers = manyUser.slice(4)

        const vendorProfileToCreatePromise = [
            ...manyUser
                .slice(0, 4)
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

        // Update the user with the vendor profile
        mainUser.vendorProfile = vendorProfile._id
        mainUser.myChats = manyUser.map((user) => user._id)

        // Create a new user
        const user = await User.create(mainUser)

        // Create many users
        await User.insertMany(manyUser)

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
                {
                    user: user._id,
                    subEvents: assignRandomSubEvents(subEventToCreate),
                },
                ...guestUsers.map((user) => ({
                    user: user._id,
                    subEvents: assignRandomSubEvents(subEventToCreate),
                })),
            ],
            serviceList: [
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvent: getRandomElement(subEventToCreate)._id,
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    servicesOffering: getRandomElement(vendorUser.services),
                    amount: faker.finance.amount(),
                    paymentStatus: getRandomElement([
                        "pending",
                        "paid",
                        "failed",
                    ]),
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
            serviceList: [
                {
                    vendorProfile: user.vendorProfile,
                    subEvent: getRandomElement(inviteSubEventToCreate)._id,
                    status: "pending",
                    servicesOffering: getRandomElement(vendorProfile.services),
                    amount: faker.finance.amount(),
                    paymentStatus: getRandomElement([
                        "pending",
                        "paid",
                        "failed",
                    ]),
                },
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvent: getRandomElement(subEventToCreate)._id,
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    servicesOffering: getRandomElement(vendorUser.services),
                    amount: faker.finance.amount(),
                    paymentStatus: getRandomElement([
                        "pending",
                        "paid",
                        "failed",
                    ]),
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
                event.serviceList.filter((service) => {
                    return (
                        service.subEvent.toString() ===
                        subEventToCreate[i]._id.toString()
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
                    event.serviceList.filter((service) => {
                        return (
                            service.subEvent.toString() ===
                            subEventToCreate[i]._id.toString()
                        )
                    }),
                )
        }

        const chatId = generateChatId(
            user._id.toString(),
            user.myChats[0].toString(),
        )

        //run this for 5 times
        for (let i = 0; i < 5; i++) {
            await ChatMessage.create({
                senderId: user._id,
                chatId: chatId,
                message: faker.lorem.sentence(),
            })

            await ChatMessage.create({
                senderId: user.myChats[0],
                chatId: chatId,
                message: faker.lorem.sentence(),
            })
        }

        // Create a channel for the event
        const channel = await Channel.create({
            name: "Photo Sharing",
            allowedUsers: [user._id],
        })

        // Create a chat message in the channel
        await ChatMessage.create({
            senderId: user._id,
            chatId: channel._id,
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
