import { addDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-date-range"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

const DatePicker = () => {
  const navigate = useNavigate()
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ])

  const handleSelect = (ranges: any) => {
    setState([ranges.selection])
  }

  return (
    <DateRange
      // editableDateInputs={true}
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
      ranges={state}
      className="mx-auto my-3 text-gray-700"
    />
  )
}

export default DatePicker
