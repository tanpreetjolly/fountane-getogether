import { Services, VendorProfile } from "../models"
import { Request, Response } from "express"
import { BadRequestError, NotFoundError } from "../errors"
import { StatusCodes } from "http-status-codes"

export const createService = async (req: Request, res: Response) => {
    const { vendorId } = req.params
    const service = await Services.create({
        ...req.body,
        vendorProfileId: vendorId,
        items: req.body.items.map((item: any) => {
            return {
                name: item.name,
                description: item.description,
                price: item.price,
            }
        }),
    })
    const vendorProfile = await VendorProfile.findByIdAndUpdate(vendorId, {
        $push: { services: service._id },
    })
    if (!vendorProfile) {
        await service.deleteOne()
        throw new NotFoundError("Vendor Profile not found")
    }
    res.status(StatusCodes.CREATED).json({
        message: "Service created successfully",
        success: true,
    })
}

export const updateService = async (req: Request, res: Response) => {
    const service = await Services.findOneAndUpdate(
        { _id: req.params.serviceId },
        {
            ...req.body,
            items: req.body.items.map((item: any) => {
                if (item.isNew === true)
                    return {
                        name: item.name,
                        description: item.description,
                        price: item.price,
                    }
                return item
            }),
        },
        { new: true },
    )
    if (!service) {
        throw new BadRequestError("Service not found")
    }
    res.status(StatusCodes.OK).json({
        message: "Service updated successfully",
        success: true,
    })
}
