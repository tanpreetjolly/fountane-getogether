import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import { useState } from "react"
import { FaRegCalendarPlus } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange"
import Button from "../components/Button"
import { createSubEvent } from "@/api"
import toast from "react-hot-toast"
import { useEventContext } from "@/context/EventContext"

const CreateFestivity = () => {
  const [festivityName, setFestivityName] = useState("")
  const [venue, setVenue] = useState("")
  const [startDate, setStartDate] = useState<string | any>("")
  const [endDate, setEndDate] = useState<string | any>("")

  const navigate = useNavigate()
  const { eventId } = useParams()

  const { updateEvent } = useEventContext()

  const handleCreateEvent = () => {
    toast.promise(
      createSubEvent(eventId as string, {
        name: festivityName,
        venue,
        startDate,
        endDate,
      }),
      {
        loading: "Creating Festivity",
        success: (data: { data: { subEventId: string } }) => {
          updateEvent()
          navigate(`${data.data.subEventId}`)
          return "Festivity Created Successfully"
        },
        error: (err) => {
          console.log(err)
          return "Failed to create Festivity"
        },
      },
    )
  }

  return (
    <div className="px-4 mx-auto flex flex-col min-h-[85vh] gap-3 lg:w-5/6 bg-white p-5 my-2 rounded-2xl border shadow-sm ">
      <div className="flex items-center justify-between">
        <div className="text-2xl  text-slate-800">Create Festivity </div>

        <Button
          text="Create Festivity"
          icon={<FaRegCalendarPlus />}
          onClick={handleCreateEvent}
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1">
        <input
          id="festivity"
          name="festivity"
          placeholder="Your Festivity Name Here"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          value={festivityName}
          onChange={(e) => setFestivityName(e.target.value)}
        />
        <input
          id="venue"
          name="venue"
          placeholder="Event Venue"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </div>
      <DatePickerWithRange
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate as any}
        setEndDate={setEndDate as any}
        className="sm:w-fit"
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

export default CreateFestivity
