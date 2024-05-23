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
        <div className="text-center text-2xl font-bold text-gray-500">
          No Events Found
        </div>
      ) : (
        user.events.map((event) => (
          <div>
            <EventCard event={event} />
          </div>
        ))
      )}
    </div>
  )
}

export default AllEvent
