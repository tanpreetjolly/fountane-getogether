import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import { TextField } from "@mui/material"
import { styled } from "@mui/system"
import { FaRegCalendarPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import DatePicker from "../components/DatePicker"
import Button from "../components/Button"

const RoundedTextField = styled(TextField)(({}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
  },
}))

// const RoundedSelect = styled(Select)(() => ({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: 10,
//   },
// }))

const CreateFestivity = () => {
  const navigate = useNavigate()

  const handleCreateEvent = () => {
    navigate("/events/1/festivities/100")
  }
  return (
    <div className="px-4 mx-auto flex flex-col min-h-[90vh]">
      <RoundedTextField
        id="festivity"
        name="festivity"
        label="Your Festivity Name Here"
        variant="outlined"
        fullWidth
      />

      <RoundedTextField
        id="venue"
        name="venue"
        label="Event Venue"
        variant="outlined"
        fullWidth
        className="!mt-4"
      />

      <DatePicker />
      <div className="mt-auto mb-4">
        <Button
          text="Create Event"
          icon={<FaRegCalendarPlus />}
          onClick={handleCreateEvent}
        />
      </div>
      <style>
        {`
        .rdrCalendarWrapper{
          font-size : 0.8rem;
        }
        .rdrDateDisplayWrapper{
          background-color: transparent;
        }`}
      </style>
    </div>
  )
}

export default CreateFestivity
