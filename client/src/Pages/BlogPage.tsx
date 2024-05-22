import { BsFillCalendarEventFill, BsFillPeopleFill } from "react-icons/bs"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { FaCreditCard, FaPeopleCarry } from "react-icons/fa"
import SubEventCard from "./SubEventCard"

type Props = {}
// a data array to .map() SubeventCard on 
const data = [

  {
    id: "1",
    name: "Wedding",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "2",
    name: "Birthday",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "3",
    name: "Anniversary",
    date: "12th August 2022",
    venue: "Mumbai",
  },
  {
    id: "4",
    name: "Party",
    date: "12th August 2022",
    venue: "Mumbai",
  },
]
  const EventPage = (props: Props) => {
  const navigate = useNavigate()
  return (
    <div className="px-4 space-y-2">
      <Button
        text="Budgets and Payments"
        icon={<FaCreditCard />}
        onClick={() => navigate("/create-festivity")}
      />
      <div className="flex justify-around gap-3">
        <div className="flex items-center justify-around bg-teal-500 text-white rounded-md w-1/2 px-4 py-6 gap-4">
          <div>
            <div className="text-gray-100 ">Manage</div>
            <div className="font-bold text-xl"> Guests</div>
          </div>
          <BsFillPeopleFill className="text-3xl" />
        </div>
        <div className="flex items-center justify-around bg-indigo-500 text-white border rounded-md w-1/2 px-4 py-6 gap-4">
          <div>
            <div className="text-gray-100 ">Manage</div>
            <div className="font-bold text-xl"> Vendors</div>
          </div>
          <FaPeopleCarry className="text-4xl" />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-3">
          {data.map((event) => (
            <SubEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      <Button
        text="Add a Festivity"
        icon={<BsFillCalendarEventFill />}
        onClick={() => navigate("/create-festivity")}
      />
    </div>
  )
}

export default EventPage
