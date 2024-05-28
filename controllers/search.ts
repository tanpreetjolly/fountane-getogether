import { User, VendorProfile } from "../models"
import { Request, Response } from "express"
import { BadRequestError } from "../errors"
import { StatusCodes } from "http-status-codes"

const search = async (req: Request, res: Response) => {
    const { type, query } = req.query as {
        type: string
        query: string
    }
    if (!query) throw new BadRequestError("Query is required")

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
        case "vendor":
            // const vendorTotalCount = await Vendor.countDocuments({
            //     services: {
            //         $elemMatch: {
            //             serviceName: { $regex: query, $options: "i" },
            //         },
            //     },
            // })

            const vendors = await VendorProfile.find({
                services: {
                    $elemMatch: {
                        serviceName: { $regex: query, $options: "i" },
                    },
                },
            })
                .select("user services")
                .populate("user", "name email phoneNo profileImage")
            // .skip(req.pagination.skip)
            // .limit(req.pagination.limit)
            // .sort({ createdAt: -1 })

            return res.status(StatusCodes.OK).json({
                data: {
                    vendors,
                    // totalCount: vendorTotalCount,
                    // page: req.pagination.page,
                    // limit: req.pagination.limit,
                },
                success: true,
                msg: "Vendors Fetched Successfully",
            })

        default:
            throw new BadRequestError(
                "Invalid type, accepted types are 'user' and 'blog'",
            )
    }
}

export { search }
