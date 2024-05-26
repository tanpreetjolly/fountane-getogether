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
  console.log(user)
  if (loading) return <Loader />
  if (!isAuthenticated || !user)
    return <div>Please Login to view this page</div>

  return (
    <div className="px-4 mx-auto">
      <Button
        text="Create an Event"
        icon={<FaPlus />}
        onClick={() => navigate("/events/create")}
      />
      {user.events.length === 0 ? (
        <div className="text-center italic text-xl px-4  text-gray-500 h-[40vh] flex items-center justify-center">
          No events to show, Create your first event
        </div>
      ) : (
        user.events.map((event) => (
          <div className="mt-4 flex flex-col gap-2">
            <EventCard event={event} />
          </div>
        ))
      )}
    </div>
  )
}

export default AllEvent
