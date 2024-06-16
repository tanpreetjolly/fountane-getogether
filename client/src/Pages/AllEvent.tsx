import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
import { useAppSelector } from "../hooks"
import Loader from "../components/Loader"
import { CalendarPlus } from "lucide-react"

const AllEvent = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.user,
  )
  console.log(user)
  const [activeTab, setActiveTab] = useState("events") // Add a state for active tab

  // console.log(user);
  if (loading) return <Loader />
  if (!isAuthenticated || !user)
    return <div>Please Login to view this page</div>

  const events = [...user.events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )
  const serviceEvents = [...user.serviceEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <div className="px-4 mx-auto py-2 flex flex-col justify-between md:w-5/6">
      <div className="mt-2 gap-1  flex flex-col w-full ">
        <div className="bg-sky-100 px-4 rounded-2xl pt-4 pb-2">
          <div className="flex justify-between items-center ">
            <div>
              <div className="text-2xl md:text-2xl pl-1 font-medium text-zinc-700">
                Good Morning, <br className="md:hidden" />
                <span className="font-semibold text-gray-800">{user.name}</span>
              </div>
              <div className="text-slate-600 pl-1 pb-2 mt-1">
                Here are your upcoming Events
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate("/events/create")}
                className="hidden bg-yellowShade rounded-xl hover:bg-yellow-400 transition-background duration-100 font-medium md:flex items-center text-zinc-900 px-5 py-3 gap-1"
              >
                <CalendarPlus size={18} />
                <span>Create an Event</span>
              </button>
              {/* <Button text="Create an Event" icon={<FaPlus />} onClick={() => navigate("/events/create")} /> */}
            </div>
          </div>
          {/* Add tabs */}
          {user.isVendor == true && (
            <div className="flex items-end  flex-wrap justify-between gap-2 md:px-1 mt-2 md:mt-4 pb-2 ">
              <div className="flex gap-2 ">
                <button
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-100 ${
                    activeTab === "events"
                      ? "bg-dark text-white"
                      : "bg-gray-50 border border-gray-700 text-gray-800 hover:outline outline-1 outline-dark "
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  Guest Events
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200   ${
                    activeTab === "serviceEvents"
                      ? "bg-dark text-white "
                      : "bg-gray-50 border border-gray-700 text-gray-800 hover:outline outline-1 outline-dark "
                  }`}
                  onClick={() => setActiveTab("serviceEvents")}
                >
                  Service Events
                </button>
              </div>
              <div className="text-sm text-gray-600 md:*:italic pl-1">
                {activeTab === "events"
                  ? "Events you are attending"
                  : "Events you are providing services for"}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 md:grid grid-cols-3">
          {(activeTab === "events" ? events : serviceEvents).length === 0 && (
            <div className="text-center italic text-xl px-4 text-gray-500 h-[40vh] flex items-center justify-center">
              No events to show, Create your first event
            </div>
          )}
          {activeTab === "events" &&
            events.map((event) => (
              <div className="mt-2 flex flex-col gap-2" key={event._id}>
                <EventCard event={event} />
              </div>
            ))}
          {activeTab === "serviceEvents" &&
            serviceEvents.map((event) => <EventCard event={event} asVendor />)}
        </div>
      </div>
      <div className="gap-2 md:hidden items-center fixed w-full flex justify-center backdrop-blur-md py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
        <Button
          text="Create an Event"
          icon={<FaPlus />}
          onClick={() => navigate("/events/create")}
        />
      </div>
    </div>
  )
}

export default AllEvent
