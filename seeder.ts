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

const sampleService = [
    {
        serviceName: "Photography ",
        serviceDescription:
            "We provide the best photography services! for weddings, birthdays, and other events.",
        serviceImage:
            "https://media.wired.com/photos/65f48f0eb170002287195c73/master/w_1600%2Cc_limit/NatGeo_CampbellAddyFeelingSeen_106_UHD_Photographer_03.jpg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Standard",
                description:
                    "Full Day photography for any event - wedding, birthday etc. ",
                price: 500,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Deluxe Plan",
                description:
                    "All benefits of standard plan included and full event video added.",
                price: 900,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Plan",
                description: "Need customization, choose our custom plan",
                price: 0,
            },
        ],
    },
    {
        serviceName: "Catering",
        serviceDescription:
            "We offer a variety of catering services for your events. From casual buffets to formal sit-down dinners, we have got you covered.",
        serviceImage:
            "https://cdn0.weddingwire.in/vendor/5137/3_2/960/png/annotation-2_15_275137-159901860574657.jpeg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Buffet Service",
                description:
                    "A variety of food options served in a buffet style.",
                price: 250,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Plated Dinner Service",
                description:
                    "A formal dining experience with a three-course meal.",
                price: 350,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Menu",
                description:
                    "Need a custom menu? We can accommodate your dietary needs and preferences.",
                price: 0,
            },
        ],
    },
    {
        serviceName: "Decorating",
        serviceDescription:
            "We specialize in creating beautiful and unique event decorations. From centerpieces to lighting, we can transform any venue into a magical space.",
        serviceImage:
            "https://media-api.xogrp.com/images/e6e01f3a-1d1e-42eb-a1f7-4f033534e6f2~rs_768.h",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Standard Decor Package",
                description:
                    "Includes basic decorations such as tablecloths, centerpieces, and lighting.",
                price: 300,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Premium Decor Package",
                description:
                    "Includes all standard decorations, plus additional features such as custom centerpieces and upgraded lighting.",
                price: 500,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Decor Package",
                description:
                    "Need a unique decoration for your event? We can create a custom package to suit your needs.",
                price: 0,
            },
        ],
    },
    {
        serviceName: "Music",
        serviceDescription:
            "We provide live music for all types of events. From a soloist to a full band, we have the perfect music for your event.",
        serviceImage:
            "https://t3.ftcdn.net/jpg/06/16/07/70/360_F_616077017_Jp4pLORx9f3TihEDLq0P9tX6mpXmk6iO.jpg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Soloist",
                description:
                    "A single musician performing a variety of genres.",
                price: 200,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Duo",
                description: "Two musicians performing a variety of genres.",
                price: 300,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Full Band",
                description:
                    "A full band with a variety of instruments and a wide repertoire.",
                price: 500,
            },
        ],
    },
    {
        serviceName: "Transportation",
        serviceDescription:
            "We offer transportation services for your guests. From shuttle buses to limousines, we can get your guests to and from your event safely and in style.",
        serviceImage:
            "https://navata.com/cms/wp-content/uploads/2021/05/transportation-modes-for-shifting-households.jpg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Shuttle Bus",
                description: "A bus that can transport up to 50 guests.",
                price: 150,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Limousine",
                description:
                    "A luxury vehicle that can transport up to 10 guests.",
                price: 300,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Transportation",
                description:
                    "Need transportation for a larger group or a unique vehicle? We can accommodate your needs.",
                price: 0,
            },
        ],
    },
    {
        serviceName: "Venue",
        serviceDescription:
            "We offer a variety of venues for your event. From intimate spaces to large event halls, we have the perfect venue for your needs.",
        serviceImage:
            "https://www.travelopro.com/public/images/contents/hotel-provider1.jpg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Intimate Space",
                description:
                    "A small venue that can accommodate up to 50 guests.",
                price: 500,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Large Event Hall",
                description:
                    "A large venue that can accommodate up to 500 guests.",
                price: 1500,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Venue",
                description:
                    "Need a unique venue for your event? We can help you find the perfect space.",
                price: 0,
            },
        ],
    },
    {
        serviceName: "Entertainment",
        serviceDescription:
            "We offer a variety of entertainment options for your event. From magicians to DJs, we can keep your guests entertained all night long.",
        serviceImage:
            "https://miro.medium.com/v2/resize:fit:1400/0*3N3v1wVmf6tuvU88.jpg",
        items: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Magician",
                description:
                    "A professional magician who will amaze and delight your guests.",
                price: 200,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "DJ",
                description:
                    "A DJ who will play a variety of music to keep your guests dancing.",
                price: 300,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "Custom Entertainment",
                description:
                    "Need a unique entertainment option for your event? We can help you find the perfect act.",
                price: 0,
            },
        ],
    },
]
const createVendorServices = async (vendorId: string) => {
    const newChannels = await Services.insertMany(
        sampleService.map((service) => ({
            ...service,
            vendorProfileId: vendorId,
        })),
    )
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
        await Task.deleteMany({})
        await Services.deleteMany({})
        console.log("Old data has been successfully removed!")

        // Create a vendor profile for the user
        const vendorProfile = await VendorProfile.create({
            _id: "60f1b9e3b3f1f3b3b3f45678",
            user: "60f1b9e3b3f1f3b3b3f1f3b3",
            services: await createVendorServices("60f1b9e3b3f1f3b3b3f45678"),
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
                .map(async (user) => {
                    const vendorId = new mongoose.Types.ObjectId()
                    return {
                        _id: vendorId,
                        user: user._id,
                        services: await createVendorServices(
                            vendorId.toString(),
                        ),
                    }
                }),
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
            _id: "60f1b9e3b3f1f3b3b3785151",
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
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    expectedGuests: 9,
                },
                ...guestUsers.map((user) => ({
                    user: user._id,
                    subEvents: assignRandomSubEvents(subEventToCreate),
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    expectedGuests: Math.floor(Math.random() * 10),
                })),
            ],
            serviceList: [
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvent: getRandomElement(subEventToCreate)._id,
                    estimatedGuests: faker.finance.pin(),
                    offerBy: getRandomElement(["vendor", "user"]),
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    servicesOffering: getRandomElement(vendorUser.services),
                    planSelected: getRandomElement(
                        getRandomElement(sampleService).items,
                    ),
                    paymentStatus: getRandomElement([
                        "pending",
                        "paid",
                        "failed",
                    ]),
                })),
            ],
        })

        Task.insertMany([
            {
                name: "Send invitations",
                completed: false,
                eventId: event._id,
            },
            {
                name: "Book a venue",
                completed: true,
                eventId: event._id,
            },
            {
                name: "Hire a cater",
                completed: false,
                eventId: event._id,
            },
            {
                name: "Hire a photographer",
                completed: false,
                eventId: event._id,
            },
        ])

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
                    estimatedGuests: faker.finance.pin(),
                    offerBy: getRandomElement(["vendor", "user"]),
                    status: "pending",
                    servicesOffering: getRandomElement(vendorProfile.services),
                    planSelected: getRandomElement(
                        getRandomElement(sampleService).items,
                    ),
                    paymentStatus: getRandomElement([
                        "pending",
                        "paid",
                        "failed",
                    ]),
                },
                ...vendorProfileToCreate.map((vendorUser) => ({
                    vendorProfile: vendorUser._id,
                    subEvent: getRandomElement(subEventToCreate)._id,
                    estimatedGuests: faker.finance.pin(),
                    offerBy: getRandomElement(["vendor", "user"]),
                    status: getRandomElement([
                        "accepted",
                        "rejected",
                        "pending",
                    ]),
                    servicesOffering: getRandomElement(vendorUser.services),
                    planSelected: getRandomElement(
                        getRandomElement(sampleService).items,
                    ),
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
