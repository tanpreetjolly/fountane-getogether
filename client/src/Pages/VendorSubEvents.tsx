import { useNavigate } from "react-router-dom"
import SubEventCard from "./SubEventCard"

type Props = {}
const data = [
  {
    _id: "100",
    name: "Wedding",
    venue: "Mumbai",
    startDate: "2022-08-12T00:00:00.000Z",
    endDate: "2024-08-23T00:00:00.000Z",
    channels: [],
    createdAt: "2022-08-12T00:00:00.000Z",
  },
  {
    _id: "200",
    name: "Birthday",
    venue: "Mumbai",
    startDate: "2022-08-12T00:00:00.000Z",
    endDate: "2024-08-23T00:00:00.000Z",
    channels: [],
    createdAt: "2022-08-12T00:00:00.000Z",
  },
  {
    _id: "300",
    name: "Anniversary",
    venue: "Mumbai",
    startDate: "2022-08-12T00:00:00.000Z",
    endDate: "2024-08-23T00:00:00.000Z",
    channels: [],
    createdAt: "2022-08-12T00:00:00.000Z",
  },
  {
    _id: "400",
    name: "Party",
    venue: "Mumbai",
    startDate: "2022-08-12T00:00:00.000Z",
    endDate: "2024-08-23T00:00:00.000Z",
    channels: [],
    createdAt: "2022-08-12T00:00:00.000Z",
  },
]
const VendorSubEvents = (_props: Props) => {
  const navigate = useNavigate()
  return (
    <div className="px-4">
      <div className="font-bold text-xl mb-3">X Weds Y</div>
      <div className="mb-2">Host: Emily Jonets</div>
      <div className="mb-2">12th August 2022 - 23rd August 2024</div>
      <div className="font-bold mb-2">Sub Events</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        {data.map((event) => (
          <button
            key={event._id}
            onClick={() => {
              navigate(`festivity/${event._id}`)
            }}
            className="focus:outline-none"
          >
            <SubEventCard subEvent={event} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default VendorSubEvents
