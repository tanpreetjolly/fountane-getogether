import { To, useNavigate } from "react-router-dom"
import { SubEventType } from "../definitions"
import { format } from "date-fns"
import { CalendarDays, MapPin, MoveRight } from "lucide-react"
import ButtonSecondary from "../components/ButtonSecondary"
type Props = {
  subEvent: SubEventType
  url?: To
}

const SubEventCard = (props: Props) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }
  const navigate = useNavigate()
  return (
    <div
      className="p-4 pr-5 flex flex-col   text-left bg-white w-full border border-gray-300 rounded-lg shadow-sm 
    "
    >
      <div className="flex justify-between text-left items-start">
        <div className="space-y-4">
          <div className="pl-1 ">
            <div className="text-xs text-indigo-600 font-medium rounded-full flex items-center gap-1 mb-1 ">
              <CalendarDays className="inline mb-0.5" size={16} />
              {formatDate(props.subEvent.startDate)} -{" "}
              {formatDate(props.subEvent.endDate)}
            </div>
            <div className="text-xl    font-semibold text-slate-800 ">
              {props.subEvent.name}
            </div>
          </div>
          <ButtonSecondary
            text="View Festivity"
            onClick={() => {
              navigate(props.url as To)
            }}
            icon={<MoveRight size={16} />}
            fontSize="text-sm"
          />
        </div>
        <div className="text-sm text-slate-800  rounded-full  flex items-center gap-1">
          <MapPin className="inline gap-1 mb-0.5" size={14} />
          {props.subEvent.venue}
        </div>
      </div>
    </div>
  )
}

export default SubEventCard
