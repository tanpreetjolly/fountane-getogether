import { BsFillCalendarEventFill, BsFillPeopleFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { FaCreditCard, FaPeopleCarry } from "react-icons/fa"
import SubEventCard from "./SubEventCard"
import { useState, useEffect } from "react"
import { EventFull } from "../definitions"
import { getEvent } from "../api"
import Loader from "../components/Loader"

const subevents = [
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
const EventPage = () => {
  const [event, setEvent] = useState<EventFull | any>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const { eventId } = useParams()

  console.log(event)

  useEffect(() => {
    if (!eventId) return
    getEvent(eventId)
      .then((data) => {
        setEvent(data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return <Loader />

  return (
    <div className="px-4 space-y-2">
      <Button
        text="Budgets and Payments"
        icon={<FaCreditCard />}
        onClick={() => navigate("payments-budget")}
      />
      <div className="flex justify-around gap-3">
        <button
          onClick={() => {
            navigate("manage-guests")
          }}
          className="flex items-center justify-around bg-teal-500 text-white rounded-md w-1/2 px-4 py-6 gap-4"
        >
          <div>
            <div className="text-gray-100 ">Manage</div>
            <div className="font-bold text-xl"> Guests</div>
          </div>
          <BsFillPeopleFill className="text-3xl" />
        </button>
        <button
          onClick={() => {
            navigate("manage-vendors")
          }}
          className="flex items-center justify-around bg-indigo-500 text-white border rounded-md w-1/2 px-4 py-6 gap-4"
        >
          <div>
            <div className="text-gray-100 ">Manage</div>
            <div className="font-bold text-xl"> Vendors</div>
          </div>
          <FaPeopleCarry className="text-4xl" />
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-3">
          {subevents.map((event) => (
            <button
              onClick={() => {
                navigate(`festivities/${event.id}`)
              }}
            >
              <SubEventCard key={event.id} event={event} />
            </button>
          ))}
        </div>
      </div>
      <Button
        text="Add a Festivity"
        icon={<BsFillCalendarEventFill />}
        onClick={() => navigate("create-festivity")}
      />
    </div>
  )
}

export default EventPage
