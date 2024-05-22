import User from "../models/user"
import Vendor from "../models/vendorProfile"
import { Request, Response } from "express"
import { BadRequestError } from "../errors"
import { StatusCodes } from "http-status-codes"

const search = async (req: Request, res: Response) => {
    const { type, query } = req.query
    if (!query) throw new BadRequestError("Query is required")

    switch (type) {
        case "user":
            const userTotalCount = await User.countDocuments({
                name: { $regex: query, $options: "i" } as any,
            })
            const users = await User.find({
                name: { $regex: query, $options: "i" } as any,
            })
                .select("name email profileImage")
                .skip(req.pagination.skip)
                .limit(req.pagination.limit)
                .sort({ createdAt: -1 })

            return res.status(StatusCodes.OK).json({
                data: {
                    users,
                    totalCount: userTotalCount,
                    page: req.pagination.page,
                    limit: req.pagination.limit,
                },
                success: true,
                msg: "Users Fetched Successfully",
            })
        case "vendor":
            const vendorTotalCount = await Vendor.countDocuments({
                services: {
                    $elemMatch: {
                        serviceName: { $regex: query, $options: "i" },
                    },
                },
            })

            const vendors = await Vendor.find({
                services: {
                    $elemMatch: {
                        serviceName: { $regex: query, $options: "i" },
                    },
                },
            })
                .select("userId services")
                .skip(req.pagination.skip)
                .limit(req.pagination.limit)
                .sort({ createdAt: -1 })

            return res.status(StatusCodes.OK).json({
                data: {
                    vendors,
                    totalCount: vendorTotalCount,
                    page: req.pagination.page,
                    limit: req.pagination.limit,
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
