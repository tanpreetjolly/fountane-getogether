import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
import { useAppSelector } from "../hooks"
import Loader from "../components/Loader"
const AllEvent = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.user,
  )
  // console.log(user)
  if (loading) return <Loader />
  if (!isAuthenticated || !user)
    return <div>Please Login to view this page</div>

  const events = [...user.events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <div className="px-4 mx-auto py-2 flex flex-col justify-between  md:w-4/5">
      <div className="mt-2">
        <div className="text-2xl md:text-3xl pl-1 font-bold text-slate-700">
          Hello, {user.name} 👋
        </div>
        <div className="text-slate-600 pl-1 pb-1 md:text-lg">
          Here are your upcoming Events
        </div>

        <div className="flex flex-col gap-3 md:grid grid-cols-3">
          {events.length === 0 ? (
            <div className="text-center italic text-xl px-4  text-gray-500 h-[40vh] flex items-center justify-center">
              No events to show, Create your first event
            </div>
          ) : (
            events.map((event) => (
              <div className="mt-2 flex flex-col  gap-2" key={event._id}>
                <EventCard event={event} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="gap-2 items-center fixed w-full flex justify-center backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
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
