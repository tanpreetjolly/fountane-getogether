import { SubEvent } from "../definitions"
import { format } from "date-fns"
type Props = {
  subEvent: SubEvent
}

const SubEventCard = (props: Props) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }
  return (
    <div
      className="bg-white border rounded-md p-4 cursor-pointer transition duration-300
    "
    >
      <div className="flex justify-between text-left items-center">
        <div>
          <div className="text-lg mb-1 font-semibold">
            {props.subEvent.name}
          </div>
          <div className="text-sm text-gray-500">
            {" "}
            {formatDate(props.subEvent.startDate)} -{" "}
            {formatDate(props.subEvent.endDate)}
          </div>
        </div>
        <div className="text-sm text-gray-500">{props.subEvent.venue}</div>
      </div>
    </div>
  )
}

export default SubEventCard
