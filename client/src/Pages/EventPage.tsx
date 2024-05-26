import { BsFillCalendarEventFill, BsFillPeopleFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { FaCreditCard, FaPeopleCarry } from "react-icons/fa"
import SubEventCard from "./SubEventCard"
import Loader from "../components/Loader"
import { useEventContext } from "../context/EventContext"
import { SubEvent } from "../definitions"

const EventPage = () => {
  const navigate = useNavigate()

  const { event, loadingEvent } = useEventContext()

  if (loadingEvent) return <Loader />
  if (!event) return <div>Event not found</div>

  return (
    <div className="px-4 flex flex-col gap-2 h-[87.5vh] overflow-hidden">
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
          className="flex font-inter items-center  justify-around bg-indigo-500  text-white  rounded-lg w-1/2 px-4 py-6 gap-4"
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
          className="flex font-inter items-center  justify-around bg-slate-800  text-white  rounded-lg w-1/2 px-4 py-6 gap-4"
        >
          <div className="">
            <div className="text-gray-200 text-left text-sm">Manage</div>
            <div className="font-bold text-xl"> Vendors</div>
          </div>
          <FaPeopleCarry className="text-4xl" />
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-3 h-[52.5dvh] overflow-y-auto">
          {event.subEvents.map((subEvent: SubEvent) => (
            <SubEventCard
              key={subEvent._id}
              subEvent={subEvent}
              url={`festivities/${subEvent._id}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 items-center">
      <Button
        text="Add Festivity"
        icon={<BsFillCalendarEventFill />}
        onClick={() => navigate("create-festivity")}
      />
      <Button
        text="Payments"
        icon={<FaCreditCard />}
        onClick={() => navigate("payments-budget")}
      />
      </div>
    </div>
  )
}

export default EventPage
