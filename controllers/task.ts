import { Task } from "../models"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors"

const getTasks = async (req: Request, res: Response) => {
    const eventId = req.params.eventId
    const tasks = await Task.find({
        eventId,
    })

    if (!tasks)
        throw new NotFoundError(`No tasks for event with id: ${eventId}`)

    res.status(StatusCodes.OK).json({
        data: tasks,
        success: true,
        msg: "Tasks Fetched Successfully",
    })
}

const getTask = async (req: Request, res: Response) => {
    const { eventId, taskId } = req.params
    const task = await Task.findOne({ _id: taskId, eventId })
    if (!task)
        throw new NotFoundError(
            `No task with id: ${taskId} for event with id: ${eventId}`,
        )

    res.status(StatusCodes.OK).json({ task })
}

const createTasks = async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { name, completed } = req.body

    const task = await Task.create({ name, completed, eventId })
    res.status(StatusCodes.CREATED).json({
        data: task,
        success: true,
        msg: "Task Created Successfully",
    })
}

const updateTasks = async (req: Request, res: Response) => {
    const taskId = req.params.taskId
    const eventId = req.params.eventId

    const { name, completed } = req.body

    if (!name && !completed)
        throw new BadRequestError("Please provide name or completed")

    const task = await Task.findByIdAndUpdate(
        { _id: taskId, eventId },
        { name, completed },
        {
            new: true,
            runValidators: true,
        },
    )
    if (!task) throw new NotFoundError(`No task with id: ${taskId}`)

    res.status(StatusCodes.OK).json({
        data: task,
        success: true,
        msg: `Task with id: ${taskId} updated successfully`,
    })
}

const deleteTasks = async (req: Request, res: Response) => {
    const taskId = req.params.taskId

    const task = await Task.findOneAndDelete({ _id: taskId })
    if (!task) throw new NotFoundError(`No task with id: ${taskId}`)
    res.status(StatusCodes.OK).json({
        data: { taskId },
        success: true,
        msg: `Task with id: ${taskId} deleted successfully`,
    })
}

export { getTasks, getTask, createTasks, updateTasks, deleteTasks }
