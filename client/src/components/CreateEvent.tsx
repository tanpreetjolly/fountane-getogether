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

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

Input.displayName = "Input"

const CreateEvent = () => {
  const [eventType, setEventType] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const [startDate, setStartDate] = React.useState<Date | string>("")
  const [endDate, setEndDate] = React.useState<Date | string>("")
  const [eventName, setEventName] = useState("")
  const [budget, setBudget] = useState("")

  const handleEventTypeChange = (value: string) => {
    setEventType(value)
  }

  const handleCreateEvent = () => {
    setLoading(true)
    createEvent({
      name: eventName,
      startDate: startDate.toString() as string,
      endDate: endDate.toString() as string,
      budget: budget,
      eventType: eventType,
    })
      .then((res) => {
        console.log(res.data)
        navigate(`/events/${res.data._id}`)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }
  if(loading) return toast.loading("Creating Event")
  return (
    <div className="px-4 mx-auto flex flex-col h-[85vh] mt-2 gap-4">
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
        startDate={startDate as any}
        endDate={endDate as any}
        setStartDate={setStartDate as any}
        setEndDate={setEndDate as any}
      />

      <div className="mt-auto mb-4">
        <Button
          onClick={handleCreateEvent}
          icon={<FaRegCalendarPlus />}
          text="Create Event"
        />
      </div>

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
