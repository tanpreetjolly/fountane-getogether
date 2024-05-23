import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { CiEdit } from "react-icons/ci"
import { FaCheck, FaTimes } from "react-icons/fa"

interface Event {
  id: string
  name: string
  dateRange: string
  hostName: string
  paymentStatus: "Pending" | "Paid"
  inviteStatus: "Pending" | "Accepted" | "Declined"
}

const initialEvents: Event[] = [
  {
    id: "1",
    name: "Wedding of Emily Jones and Ron",
    dateRange: "26th Jan 2024 - 28th Jan 2024",
    hostName: "Emily",
    paymentStatus: "Pending",
    inviteStatus: "Pending",
  },
  {
    id: "2",
    name: "Birthday of John Doe",
    dateRange: "26th Jan 2024 - 28th Jan 2024",
    hostName: "John",
    paymentStatus: "Paid",
    inviteStatus: "Accepted",
  },
  {
    id: "3",
    name: "Anniversary of Michael Johnson",
    dateRange: "26th Jan 2024 - 28th Jan 2024",
    hostName: "Michael",
    paymentStatus: "Paid",
    inviteStatus: "Pending",
  }
]

type Props = {}

const VendorHome: React.FC<Props> = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const handleAccept = (id: string) => {
    setEvents(events.map(event => event.id === id ? { ...event, inviteStatus: "Accepted" } : event))
  }

  const handleDecline = (id: string) => {
    setEvents(events.map(event => event.id === id ? { ...event, inviteStatus: "Declined" } : event))
  }

  const handleNavigateToEvent = (id: string) => {
    navigate(`events/${id}`)
  }

  const getStatusClassName = (status: "Pending" | "Paid") => {
    return status === "Pending" ? "text-yellow-500" : "text-green-500"
  }

  const getInviteStatusClassName = (status: "Pending" | "Accepted" | "Declined") => {
    if (status === "Accepted") return "text-green-500"
    if (status === "Declined") return "text-red-500"
    return "text-gray-500"
  }

  return (
    <div className="px-4">
      <Button
        text="Change Service & Price"
        onClick={() => {
          navigate("edit-services")
        }}
        icon={<CiEdit className="text-2xl" />}
      />
      {events.map(event => (
        <div key={event.id} className="my-4">
          <div className="border rounded-md p-4 bg-white">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-500">Event Date Range: <span>{event.dateRange}</span></p>
            <p className="text-gray-500">Host Name: <span>{event.hostName}</span></p>
            <p className="text-gray-500 mb-2">
              Payment Status: 
              <span className={`ml-1 ${getStatusClassName(event.paymentStatus)}`}>
                {event.paymentStatus}
              </span>
            </p>
            {event.inviteStatus === "Pending" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(event.id)}
                  className="bg-white border-green-500 border text-green-500 rounded-md px-3 py-1 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(event.id)}
                  className="bg-white border-red-500 border text-red-500 rounded-md px-3 py-1 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Decline
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <p className={getInviteStatusClassName(event.inviteStatus)}>
                  {event.inviteStatus}
                </p>
                {event.inviteStatus === "Accepted" && (
                  <button
                  onClick={() => handleNavigateToEvent(event.id)}
                  className="border border-blue-500 text-blue-500 rounded-md px-3 py-1"
                >
                  Go to Event
                </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorHome
