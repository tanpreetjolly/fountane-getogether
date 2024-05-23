type Props = {
  event: {
    id: string
    name: string
    date: string
    venue: string
  }
}

const SubEventCard = (props: Props) => {
  return (
    <div
      className="bg-white border rounded-md p-4 cursor-pointer transition duration-300
    "
    >
      <div className="flex justify-between text-left items-center">
        <div>
          <div className="text-lg mb-1 font-semibold">{props.event.name}</div>
          <div className="text-sm text-gray-500">{props.event.date}</div>
        </div>
        <div className="text-sm text-gray-500">{props.event.venue}</div>
      </div>
    </div>
  )
}

export default SubEventCard
