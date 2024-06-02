import { BsFillCalendarEventFill, BsFillPeopleFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { FaCreditCard, FaPeopleCarry } from "react-icons/fa"
import SubEventCard from "./SubEventCard"
import Loader from "../components/Loader"
import { useEventContext } from "../context/EventContext"
import { SubEventType } from "../definitions"
import { ListTodo } from "lucide-react"
import { useAppSelector } from "@/hooks"

const EventPage = () => {
  const navigate = useNavigate()

  const { event, loadingEvent } = useEventContext()
  const { user } = useAppSelector((state) => state.user)

  if (!user) return <div>Not logged in</div>
  if (loadingEvent) return <Loader />
  if (!event) return <div>Event not found</div>

  return (
    <div className="px-4 flex flex-col gap-2  pt-2 lg:w-4/5  lg:mx-auto   pb-20">
      <div className="pl-1 flex justify-between">
        <div>
          <div className="text-2xl lg:text-3xl font-semibold text-dark">{event.name}</div>
          <div className="text-base text-gray-700 mb-1 lg:text-lg">
            Hosted by{" "}
            <span className=" text-indigo-700">{event.host.name}</span>
          </div>
        </div>
        {event.host._id == user?.userId && (
          <button
            onClick={() => navigate("todo")}
            className="flex items-center  text-slate-80 border border-slate-800 h-fit my-auto px-4 py-1.5 rounded-2xl"
          >
            <ListTodo className="mr-1" size={20} />
            Todo
          </button>
        )}
      </div>
      {event.host._id == user?.userId && (
        <div className="flex justify-around gap-1.5 md:w-1/3">
          <button
            onClick={() => {
              navigate("guests")
            }}
            className="flex font-inter items-center  justify-around bg-indigo-500  text-white  rounded-lg w-1/2 px-4 py-4 gap-3"
          >
            <div className="">
              <div className="text-gray-100 text-left text-sm">Manage</div>
              <div className="font-bold text-xl"> Guests</div>
            </div>
            <BsFillPeopleFill className="text-3xl" />
          </button>
          <button
            onClick={() => {
              navigate("vendors")
            }}
            className="flex font-inter items-center  justify-around bg-slate-800  text-white  rounded-lg w-1/2 px-4 py-4 gap-3"
          >
            <div className="">
              <div className="text-gray-200 text-left text-sm">Manage</div>
              <div className="font-bold text-xl"> Vendors</div>
            </div>
            <FaPeopleCarry className="text-4xl" />
          </button>
        </div>
      )}
      <div>
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 my-3  overflow-y-auto">
          {event.subEvents.length == 0 && (
            <div className="text-center text-lg text-gray-700">
              No festivity added yet
            </div>
          )}
          {event.subEvents
            .filter(
              (subEvent) =>
                event.host._id == user.userId ||
                event.userList
                  .find(
                    (userListItem) =>
                      userListItem.user._id == user.userId &&
                      userListItem.status === "accepted",
                  )
                  ?.subEvents.find(
                    (subEventId) => subEventId == subEvent._id,
                  ) ||
                event.serviceList
                  .filter((service) => {
                    return service.vendorProfile._id === user.vendorProfile?._id
                  })
                  .some(
                    (service) =>
                      service.subEvent._id === subEvent._id &&
                      service.status === "accepted",
                  ),
            )
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
      {event.host._id == user?.userId && (
        <div className="flex justify-center gap-2 items-center fixed w-full backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
          <Button
            text="Add Festivity"
            icon={<BsFillCalendarEventFill />}
            onClick={() => navigate("festivity")}
          />
          <Button
            text="Payments"
            icon={<FaCreditCard />}
            onClick={() => navigate("payments")}
          />
        </div>
      )}
    </div>
  )
}

export default EventPage
