import { useNavigate } from "react-router-dom"
import SubEventCard from "./SubEventCard"

type Props = {}
const data = [
  {
    id: "100",
    name: "Wedding",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "200",
    name: "Birthday",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "300",
    name: "Anniversary",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "400",
    name: "Party",
    date: "12th August 2022",
    venue: "Mumbai",
  },

]
const VendorSubEvents = (props: Props) => {
  const navigate = useNavigate()
  return (
    <div className="px-4">
      <div className="font-bold text-xl mb-3">X Weds Y</div>
      <div className="mb-2">Host: Emily Jones</div>
      <div className="mb-2">12th August 2022 - 23rd August 2024</div>
      <div className="font-bold mb-2">Sub Events</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        {data.map((event) => (
          <button
            key={event.id}
            onClick={() => {
              navigate(`festivities/${event.id}`)
            }}
            className="focus:outline-none"
          >
            <SubEventCard event={event} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default VendorSubEvents