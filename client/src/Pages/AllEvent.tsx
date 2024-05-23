import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
const AllEvent = () => {
  const navigate = useNavigate()
  const event:any={}

  return (
    <div className="px-4 mx-auto">
      <Button
        text="Create an Event"
        icon={<FaPlus />}
        onClick={() => navigate("/events/create")}
      />
      <div>
        <EventCard event={event} />
      </div>
    </div>
  )
}

export default AllEvent
