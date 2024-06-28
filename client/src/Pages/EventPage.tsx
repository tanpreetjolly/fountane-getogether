import { BsFillCalendarEventFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { FaCreditCard } from "react-icons/fa"
import SubEventCard from "./SubEventCard"
import Loader from "../components/Loader"
import { useEventContext } from "../context/EventContext"
import { SubEventType } from "../definitions"
import {
  CalendarDays,
  CircleDollarSign,
  ListTodo,
  PlusCircle,
  Users,
} from "lucide-react"
import { useAppSelector } from "@/hooks"
import { LiaPeopleCarrySolid } from "react-icons/lia"
import { format } from "date-fns"

const EventPage = () => {
  const navigate = useNavigate()
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }
  const { event, loadingEvent } = useEventContext()
  const { user } = useAppSelector((state) => state.user)

  if (!user) return <div>Not logged in</div>
  if (loadingEvent) return <Loader />
  if (!event) return <div>Event not found</div>
  console.log(event)
  return (
    <div className="px-4 flex flex-col gap-2  pt-2 lg:w-5/6 lg:mx-auto   pb-20">
      <div className="bg-white pt-4 p-3 md:p-4 md:pt-6 rounded-2xl md:shadow-sm md:border">
        <div className="pl-1 flex justify-between items-end border-b pb-2 mb-4">
          <div className="">
            <div className="text-xs  py-0.5 text-gray-700  mb-1 gap-0.5 justify-center flex items-center font-medium md:font-normal w-fit  rounded-lg">
              <CalendarDays className="inline mb-0.5" size={14} />
              &nbsp;
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </div>
            <div className="text-xl md:ext-2xl font-medium text-dark ">
              {event.name}
            </div>
            <div className="text-sm md:text-base text-gray-700 mb-1 ">
              Hosted by <span className=" font-medium">{event.host.name}</span>
            </div>
          </div>
          {event.isHosted && (
            <button
              onClick={() => navigate("todo")}
              className="text-sm flex items-center md:hidden text-slate-800 border border-slate-800 h-fit my-auto px-3 py-1.5 rounded-2xl"
            >
              <ListTodo className="mr-1" size={14} />
              Todo
            </button>
          )}
          {event.isHosted && (
            <button
              onClick={() => navigate("festivity")}
              className="hidden bg-dark bg-opacity-90 rounded-2xl transition-background duration-100 font-medium md:flex items-center text-white px-5 py-3 gap-1"
            >
              <PlusCircle size={18} />
              <span>Add a Festivity</span>
            </button>
          )}
        </div>
        {event.isHosted && (
          <div className="flex justify-around gap-2 xl:w-3/5">
            <button
              onClick={() => {
                navigate("guests")
              }}
              className="flex  items-center  justify-around  bg-purpleShade   text-zinc-800  rounded-xl md:rounded-3xl w-1/2 px-4 py-4 gap-2"
            >
              <div className="flex flex-col">
                <div className="text-slate-700 text-left text-sm">Manage</div>
                <div className="font-medium text-lg md:text-xl "> Guests</div>
              </div>
              <Users size={24} />
            </button>
            <button
              onClick={() => {
                navigate("vendors")
              }}
              className="flex  items-center  justify-around bg-blueShade    text-zinc-800  rounded-xl md:rounded-3xl w-1/2 px-4 py-4 gap-3"
            >
              <div className="">
                <div className="text-slate-700  text-left text-sm">Manage</div>
                <div className="font-medium text-lg md:text-xl"> Vendors</div>
              </div>
              <LiaPeopleCarrySolid className="text-2xl md:text-3xl" />
            </button>
            <button
              onClick={() => {
                navigate("payments")
              }}
              className="hidden md:flex  items-center  justify-around bg-dark bg-opacity-85  text-gray-50  rounded-3xl w-1/2 px-4 py-4 gap-3"
            >
              <div className="">
                <div className="text-gray-100  text-left text-sm">
                  Budget &{" "}
                </div>
                <div className="font-medium text-xl"> Payments</div>
              </div>
              <CircleDollarSign size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => {
                navigate("todo")
              }}
              className="md:flex hidden items-center  justify-around border aspect-[2] border-slate-800  text-slate-800  rounded-3xl w-1/2 px-4 py-4 gap-3"
            >
              <div className="">
                <div className="text-slate-700 text-left text-sm">Event</div>
                <div className="font-medium text-xl">Checklist</div>
              </div>
              <ListTodo size={24} strokeWidth={1.5} />
            </button>
          </div>
        )}
        {!event.isHosted && event.isVendor && (
          <button
            onClick={() => {
              navigate("vendors")
            }}
            className="flex items-center max-w-48 justify-around bg-blueShade    text-zinc-800  rounded-3xl w-1/2 px-4 py-4 gap-3"
          >
            <div className="">
              <div className="text-slate-700  text-left text-sm">View All</div>
              <div className="font-medium text-xl"> Vendors</div>
            </div>
            <LiaPeopleCarrySolid className="text-3xl" />
          </button>
        )}
      </div>
      <div className=" bg-white rounded-2xl min-h-[60vh]  p-4 md:border md:shadow-sm">
        <div className=" text-gray-700  pl-1 text-xs md:text-sm pb-1 md:italic">
          Upcoming festivities for{" "}
          <span className="font-medium">{event.name}</span>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 my-1  overflow-y-auto">
          {event.subEvents.length == 0 && (
            <div className="text-center md:text-lg text-gray-700">
              No festivity added yet
            </div>
          )}
          {event.subEvents
            .sort(
              (a: SubEventType, b: SubEventType) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            )
            .map((subEvent: SubEventType) => (
              <SubEventCard
                key={subEvent._id}
                subEvent={subEvent}
                url={`festivity/${subEvent._id}`}
              />
            ))}
        </div>
      </div>
      {event.isHosted && (
        <div className="flex md:hidden justify-center gap-2 items-center fixed w-full backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
          <Button
            text="Add Festivity"
            fontSize="text-sm"
            icon={<BsFillCalendarEventFill />}
            onClick={() => navigate("festivity")}
          />
          <Button
            text="Payments"
            icon={<FaCreditCard />}
            fontSize="text-sm"
            onClick={() => navigate("payments")}
          />
        </div>
      )}
    </div>
  )
}

export default EventPage
