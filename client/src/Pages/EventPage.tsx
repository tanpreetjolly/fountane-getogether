import { BsFillCalendarEventFill, BsFillPeopleFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { FaCreditCard, FaPeopleCarry } from "react-icons/fa"
import SubEventCard from "./SubEventCard"
import { useState, useEffect } from "react"
import { EventFull } from "../definitions"
import { getEvent } from "../api"
import Loader from "../components/Loader"

const EventPage = () => {
  const [event, setEvent] = useState<EventFull | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const { eventId } = useParams()

  console.log(event?.subEvents)

  useEffect(() => {
    if (!eventId) return
    getEvent(eventId)
      .then((data) => {
        setEvent(data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return <Loader />
  if (!event) return <div>Event not found</div>

  return (
    <div className="px-4 flex flex-col gap-2 ">
      {/* Event Name */}
      <div className="pl-1">
        <div className="text-2xl font-bold text-dark">{event.name}</div>
        {/* Event Host */}
        <div className="text-lg text-gray-700 mb-1">
          Hosted by{" "}
          <span className="font-semibold text-dark">{event.host.name}</span>
        </div>
      </div>
      <div className="flex justify-around gap-2">
        <button
          onClick={() => {
            navigate("manage-vendors")
          }}
          className="flex font-inter items-center  justify-around bg-indigo-500  text-white  rounded-xl w-1/2 px-4 py-6 gap-4"
        >
          <div className="">
            <div className="text-gray-100 text-left text-sm">Manage</div>
            <div className="font-bold text-xl"> Guests</div>
          </div>
          <BsFillPeopleFill className="text-3xl" />
        </button>
        <button
          onClick={() => {
            navigate("manage-vendors")
          }}
          className="flex font-inter items-center  justify-around bg-slate-800  text-white  rounded-xl w-1/2 px-4 py-6 gap-4"
        >
          <div className="">
            <div className="text-gray-200 text-left text-sm">Manage</div>
            <div className="font-bold text-xl"> Vendors</div>
          </div>
          <FaPeopleCarry className="text-4xl" />
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-3 h-[50dvh] overflow-y-auto">
          {event.subEvents.map((event) => (
            <SubEventCard
              key={event.id}
              subEvent={event}
              url={`festivities/${event._id}`}
            />
          ))}
        </div>
      </div>

      <Button
        text="Add a Festivity"
        icon={<BsFillCalendarEventFill />}
        onClick={() => navigate("create-festivity")}
      />
      <Button
        text="Budgets and Payments"
        icon={<FaCreditCard />}
        onClick={() => navigate("payments-budget")}
      />
    </div>
  )
}

export default EventPage
