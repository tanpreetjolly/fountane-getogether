import * as React from "react"
import { useState } from "react"
import { FaRegCalendarPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../api"
import { DatePickerWithRange } from "./ui/DatePickerWithRange"
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select"
import { Input } from "./ui/input"
import Button from "./Button"
import toast from "react-hot-toast"
import { createEventSlice } from "../features/userSlice"
import { EventShortType } from "@/definitions"
import { useAppDispatch } from "@/hooks"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

Input.displayName = "Input"

const CreateEvent = () => {
  const [eventType, setEventType] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date>(
    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
  )
  const [eventName, setEventName] = useState("")
  const [budget, setBudget] = useState("")

  const dispatch = useAppDispatch()

  const handleEventTypeChange = (value: string) => {
    setEventType(value)
  }

  const handleCreateEvent = () => {
    setLoading(true)
    toast.loading("Creating Event", { id: "loading" })
    createEvent({
      name: eventName,
      startDate: startDate.toString() as string,
      endDate: endDate.toString() as string,
      budget: budget,
      eventType: eventType,
    })
      .then((res: { data: EventShortType }) => {
        console.log(res.data)
        navigate(`/events/${res.data._id}`)
        toast.success("Event Created", { id: "loading" })
        dispatch(createEventSlice(res.data))
      })
      .catch((err) => {
        console.log(err)
        toast.dismiss("loading")
      })
      .finally(() => {
        setLoading(false)
      })
  }
  // if(loading) return toast.loading("Creating Event")
  return (
    <div className="px-4 mx-auto flex flex-col min-h-[85vh] mt-2 gap-4 md:w-5/6 bg-white p-5 rounded-xl ">
      <div className="">
        <Button
          onClick={handleCreateEvent}
          icon={<FaRegCalendarPlus />}
          text="Create Event"
          disabled={loading}
        />
      </div>
      <Input
        id="eventName"
        name="eventName"
        placeholder="Your Event Name Here"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className=""
      />
      <Input
        id="budget"
        name="budget"
        type="number"
        placeholder="Event budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className=""
      />

      <Select value={eventType} onValueChange={handleEventTypeChange}>
        <SelectTrigger>
          <span className="text-muted-foreground">
            {eventType || "Event Type"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="wedding">Wedding</SelectItem>
          <SelectItem value="conference">Conference</SelectItem>
          <SelectItem value="party">Party</SelectItem>
          <SelectItem value="concert">Concert</SelectItem>
        </SelectContent>
      </Select>

      <DatePickerWithRange
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <style>
        {`
        .rdrCalendarWrapper{
          font-size : 0.8rem;
        }
        .rdrDateDisplayWrapper{
          background-color: transparent;
        }
      `}
      </style>
    </div>
  )
}

export default CreateEvent
