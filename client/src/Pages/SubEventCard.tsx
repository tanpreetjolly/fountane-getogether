import { To, useNavigate } from "react-router-dom"
import { SubEventType } from "../definitions"
import { format } from "date-fns"
import {
  CalendarDays,
  Loader,
  MapPin,
  MoveRight,
  SquarePen,
  Trash,
} from "lucide-react"
import ButtonSecondary from "../components/ButtonSecondary"
import { useEventContext } from "@/context/EventContext"
import { useAppSelector } from "@/hooks"
type Props = {
  subEvent: SubEventType
  url?: To
}

const SubEventCard = (props: Props) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }
  const navigate = useNavigate()

  const { event, loadingEvent } = useEventContext()
  const { user } = useAppSelector((state) => state.user)
  if (loadingEvent) return <Loader />
  if (!event) return <div>Event not found</div>
  if (!user) return <div>Not logged in</div>

  const subEventGuest = event.userList.filter((guest) =>
    guest.subEvents.includes(props.subEvent._id),
  )
  console.log(subEventGuest.length)

  return (
    <div
      className="pt-4 relative px-3 md:pl-4 gap-3 md:pr-5 flex flex-col  max-w-xl aspect-[2.2]    text-left bg-white w-full border border-gray-200 rounded-lg shadow-sm 
    "
    >
      <div className="flex justify-between text-left items-start">
        <div className="space-y-3">
          <div className=" flex flex-col">
            <div className="text-[11px]  text-slate-900  bg-sky-200 bg-opacity-80 px-3 md:py-1 rounded-full flex items-center gap-1 mb-1 ">
              <CalendarDays className="inline mb-0.5" size={12} />
              {formatDate(props.subEvent.startDate)} -{" "}
              {formatDate(props.subEvent.endDate)}
            </div>
            <div className="md:text-lg pl-1.5 mt-1.5 font-medium text-slate-800 ">
              {props.subEvent.name}
            </div>

            <div className="text-xs md:text-sm pl-1.5 text-slate-600  rounded-full flex  items-center gap-1">
              {props.subEvent.venue}
              <MapPin className="inline gap-1 mb-0.5" size={14} />
            </div>
          </div>
        </div>
        {event.host._id === user?.userId && (
          <div className="flex gap-1 p-2 absolute right-1 items-center top-1">
            <SquarePen size={18} className="text-gray-700" />
            <Trash size={18} className="text-rose-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-center absolute bottom-4 ml-1 opacity-90">
        <div className="flex -space-x-2">
          {" "}
          {subEventGuest.slice(0, 3).map((guest) => (
            <div className="w-6 md:w-7 aspect-square rounded-full overflow-hidden opacity-80">
              <img
                src={guest.user.profileImage}
                alt={guest.user.name}
                className="w-full object-cover h-full"
              />
            </div>
          ))}
          {subEventGuest.length > 3 && (
            <div className="w-6 md:w-7 aspect-square rounded-full overflow-hidden text-white bg-zinc-700 border border-slate-700 z-50 text-xs flex justify-center items-center pr-1 font-medium ">
              +{subEventGuest.length - 3}
            </div>
          )}
        </div>
      </div>
      <div className="w-fit ml-auto mt-auto">
        <ButtonSecondary
          text="View Festivity"
          onClick={() => {
            navigate(props.url as To)
          }}
          icon={<MoveRight size={16} />}
          fontSize="text-xs md:text-sm"
        />
      </div>
    </div>
  )
}

export default SubEventCard
