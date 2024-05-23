import mongoose from "mongoose"
import User from "./models/user"
import VendorProfile from "./models/vendorProfile"
import Event from "./models/event"
import ChatMessage from "./models/chatMessage"
import Channel from "./models/channel"
import connectDB from "./db/connect"
import dotenv from "dotenv"

dotenv.config()

connectDB(process.env.MONGO_URL as string)
    .then(() => {
        mongoose.connection.db.dropDatabase()
        User.create({
            _id: "60f1b9e3b3f1f3b3b3f1f3b3",
            name: "John Doe",
            email: "hello@hello.com",
            phoneNo: "1234567890",
            password: "hello@hello.com",
            status: "active",
            vendorProfile: null,
        })
            .then((createdUser) => {
                VendorProfile.create({
                    userId: createdUser._id,
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
                    .then((createdVendorProfile) => {
                        // Update user with vendor profile
                        User.findByIdAndUpdate(createdUser._id, {
                            vendorProfile: createdVendorProfile._id,
                        })
                            .then(() => {
                                Event.create({
                                    name: "Event 1",
                                    host: createdUser._id,
                                    startDate: new Date("2023-01-01T09:00:00Z"),
                                    endDate: new Date("2023-01-01T13:00:00Z"),
                                    budget: 1000,
                                })
                                    .then((createdEvent) => {
                                        Channel.create({
                                            name: "Channel 1",
                                            allowedUsers: [createdUser._id],
                                        })
                                            .then((createdChannel) => {
                                                ChatMessage.create({
                                                    userId: createdUser._id,
                                                    channelId:
                                                        createdChannel._id,
                                                    message: "Hello, world!",
                                                })
                                                    .then(() => {
                                                        Event.findByIdAndUpdate(
                                                            createdEvent._id,
                                                            {
                                                                subEvents: [
                                                                    {
                                                                        name: "Sub Event 1",
                                                                        startDate:
                                                                            new Date(
                                                                                "2023-01-01T09:00:00Z",
                                                                            ),
                                                                        endDate:
                                                                            new Date(
                                                                                "2023-01-01T13:00:00Z",
                                                                            ),
                                                                        venue: "Venue 1",
                                                                        channels:
                                                                            [
                                                                                createdChannel._id,
                                                                            ],
                                                                    },
                                                                ],
                                                            },
                                                            {
                                                                new: true,
                                                                runValidators:
                                                                    true,
                                                            },
                                                        )
                                                            .then(() => {
                                                                console.log(
                                                                    "Dummy data has been successfully created!",
                                                                )
                                                                mongoose.connection.close()
                                                            })
                                                            .catch(
                                                                (
                                                                    err: Error,
                                                                ) => {
                                                                    console.error(
                                                                        err,
                                                                    )
                                                                    mongoose.connection.close()
                                                                },
                                                            )
                                                    })
                                                    .catch((err: Error) => {
                                                        console.error(err)
                                                        mongoose.connection.close()
                                                    })
                                            })
                                            .catch((err: Error) => {
                                                console.error(err)
                                                mongoose.connection.close()
                                            })
                                    })
                                    .catch((err: Error) => {
                                        console.error(err)
                                        mongoose.connection.close()
                                    })
                            })
                            .catch((err: Error) => {
                                console.error(err)
                                mongoose.connection.close()
                            })
                    })
                    .catch((err: Error) => {
                        console.error(err)
                        mongoose.connection.close()
                    })
            })
            .catch((err: Error) => {
                console.error(err)
                mongoose.connection.close()
            })
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
