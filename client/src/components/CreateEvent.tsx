import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import React from "react"
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import { styled } from "@mui/system"
import DatePicker from "./DatePicker"
import Button from "./Button"
import { FaRegCalendarPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../api"

const RoundedTextField = styled(TextField)(({}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
  },
}))

const RoundedSelect = styled(Select)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
  },
}))

const CreateEvent = () => {
  const [eventType, setEventType] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleEventTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setEventType(event.target.value as string)
  }
  const handleCreateEvent = () => {
    setLoading(true)
    createEvent({
      name: "Event Name",
      startDate: new Date().toString(),
      endDate: new Date().toString(),
      budget: "1000",
    })
      .then((res) => {
        console.log(res.data)
        navigate(`/events/${res.data._id}`)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }
  return (
    <div className="px-4 mx-auto flex flex-col min-h-[90vh]">
      <RoundedTextField
        id="eventName"
        name="eventName"
        label="Your Event Name Here"
        variant="outlined"
        fullWidth
      />

      <RoundedTextField
        id="host"
        name="host"
        label="Event Host"
        variant="outlined"
        fullWidth
        className="!mt-4"
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="eventtype-label">Event Type</InputLabel>
        <RoundedSelect
          labelId="eventtype-label"
          id="eventtype"
          name="eventtype"
          value={eventType}
          onChange={handleEventTypeChange as any}
          label="Event Type"
          className="!rounded-xl"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="wedding">Wedding</MenuItem>
          <MenuItem value="conference">Conference</MenuItem>
          <MenuItem value="party">Party</MenuItem>
          <MenuItem value="concert">Concert</MenuItem>
        </RoundedSelect>
      </FormControl>

      <DatePicker />
      <div className="mt-auto mb-4">
        <Button
          text="Create Event"
          icon={<FaRegCalendarPlus />}
          onClick={handleCreateEvent}
          disabled={loading}
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

export default CreateEvent
