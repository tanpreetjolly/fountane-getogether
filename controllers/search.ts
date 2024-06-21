import { User, VendorProfile, Services } from "../models"
import { Request, Response } from "express"
import { BadRequestError } from "../errors"
import { StatusCodes } from "http-status-codes"

const search = async (req: Request, res: Response) => {
    const { type, query } = req.query as {
        type: string
        query: string
    }
    // if (!query) throw new BadRequestError("Query is required")

    switch (type) {
        case "user":
            // const userTotalCount = await User.countDocuments({
            //     $or: [
            //         { phoneNo: query },
            //         { email: { $regex: new RegExp(query, "i") } },
            //         { name: { $regex: new RegExp(query, "i") } },
            //     ],
            // })
            const users = await User.find({
                $or: [
                    { phoneNo: query },
                    { email: { $regex: new RegExp(query, "i") } },
                    { name: { $regex: new RegExp(query, "i") } },
                ],
            }).select("name email profileImage phoneNo")
            // .skip(req.pagination.skip)
            // .limit(req.pagination.limit)
            // .sort({ createdAt: -1 })

            return res.status(StatusCodes.OK).json({
                data: {
                    users,
                    // totalCount: userTotalCount,
                    // page: req.pagination.page,
                    // limit: req.pagination.limit,
                },
                success: true,
                msg: "Users Fetched Successfully",
            })
        case "service":
            // const vendorTotalCount = await Vendor.countDocuments({
            //     services: {
            //         $elemMatch: {
            //             serviceName: { $regex: query, $options: "i" },
            //         },
            //     },
            // })

            // const vendors = await VendorProfile.aggregate([
            //     {
            //         $lookup: {
            //             from: "services",
            //             localField: "services",
            //             foreignField: "_id",
            //             as: "servicesData",
            //         },
            //     },
            //     {
            //         $match: {
            //             "servicesData.serviceName": {
            //                 $regex: query,
            //                 $options: "i",
            //             },
            //         },
            //     },
            //     {
            //         $project: {
            //             user: 1,
            //             services: 1,
            //             servicesData: 1,
            //         },
            //     },
            //     {
            //         $lookup: {
            //             from: "users",
            //             localField: "user",
            //             foreignField: "_id",
            //             as: "userData",
            //         },
            //     },
            //     {
            //         $unwind: "$userData",
            //     },
            //     {
            //         $project: {
            //             userId: "$userData._id",
            //             name: "$userData.name",
            //             email: "$userData.email",
            //             phoneNo: "$userData.phoneNo",
            //             profileImage: "$userData.profileImage",
            //             servicesData: 1,
            //         },
            //     },
            // ])

            const services = await Services.find({
                serviceName: { $regex: query, $options: "i" },
            }).populate({
                path: "vendorProfileId",
                select: "user",
                populate: {
                    path: "user",
                    select: "name email phoneNo profileImage",
                },
            })

            return res.status(StatusCodes.OK).json({
                data: services,
                success: true,
                msg: "Services Fetched Successfully",
            })

        default:
            throw new BadRequestError(
                "Invalid type, accepted types are 'user' and 'service'",
            )
    }
}

export { search }
