import mongoose from "mongoose"
import User from "./models/user"
import VendorProfile from "./models/vendorProfile"
import Event from "./models/event"
import SubEvent from "./models/subEvent"
import ChatMessage from "./models/chatMessage"
import Channel from "./models/channel"
import connectDB from "./db/connect"
import dotenv from "dotenv"

dotenv.config()

// Connect to the database and drop the existing data
async function main() {
    try {
        await connectDB(process.env.MONGO_URL as string)
        await mongoose.connection.db.dropDatabase()

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

        // Create a vendor profile for the user
        const vendorProfile = await VendorProfile.create({
            userId: user._id,
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

        // Create an event for the user
        const event = await Event.create({
            name: "Event 1",
            host: user._id,
            startDate: new Date("2023-01-01T09:00:00Z"),
            endDate: new Date("2023-01-01T13:00:00Z"),
            budget: 1000,
        })

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

        const subEventToCreate = [
            {
                name: "Sub Event 1",
                startDate: new Date("2023-01-01T09:00:00Z"),
                endDate: new Date("2023-01-01T13:00:00Z"),
                venue: "Venue 1",
                channels: [channel._id],
            },
            {
                name: "Sub Event 2",
                startDate: new Date("2023-01-02T09:00:00Z"),
                endDate: new Date("2023-01-02T13:00:00Z"),
                venue: "Venue 2",
            },
            {
                name: "Sub Event 3",
                startDate: new Date("2023-01-03T09:00:00Z"),
                endDate: new Date("2023-01-03T13:00:00Z"),
                venue: "Venue 3",
            },
        ]

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
