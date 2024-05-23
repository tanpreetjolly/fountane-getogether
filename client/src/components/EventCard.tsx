import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { FC } from "react"
import { EventShort } from "../definitions"

interface EventCardProps {
  event: EventShort
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }

  console.log(event)

  return (
    <button
      className="container p-5 flex flex-col gap-0.5 text-left bg-white w-full border border-gray-300 my-4 rounded-lg shadow-sm  !font-inter"
      onClick={() => {
        navigate(`/events/${event._id}`)
      }}
    >
      <span className="text-2xl font-bold text-gray-700">
        Event Title - {event.name}
      </span>
      <span className="text-gray-700 text-lg font-medium">
        Event Host: {event.host.name}
      </span>
      <span className="text-gray-500 text-sm">
        {formatDate(event.startDate)} - {formatDate(event.endDate)}
      </span>
    </button>
  )
}

export default EventCard
