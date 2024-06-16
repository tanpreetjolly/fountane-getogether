import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { FC, useState } from "react"
import { EventShortType } from "../definitions"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import {
  ArrowRightToLine,
  CalendarDays,
  SquarePen,
  Trash,
  X,
} from "lucide-react"
import ButtonSecondary from "./ButtonSecondary"
import { Input } from "./ui/input"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Button from "./Button"
import { deleteEvent, updateEvent } from "../api"
import { useAppDispatch, useAppSelector } from "@/hooks"
import confirm from "./ConfirmationComponent"
import { deleteEventSlice, updateEventSlice } from "@/features/userSlice"
import { DatePickerWithRange } from "./ui/DatePickerWithRange"

interface EventCardProps {
  event: EventShortType
  asVendor?: boolean
}

const EventCard: FC<EventCardProps> = ({ event, asVendor = false }) => {
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editedEvent, setEditedEvent] = useState<EventShortType>(event)
  const [startDate, setStartDate] = useState<Date>(new Date(event.startDate))
  const [endDate, setEndDate] = useState<Date>(new Date(event.startDate))

  const [updatingEvent, setUpdatingEvent] = useState(false)

  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.user)

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }

  const handleEditEvent = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleSaveEvent = () => {
    if (updatingEvent) return

    console.log(editedEvent)

    setUpdatingEvent(true)
    updateEvent({
      ...editedEvent,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    })
      .then((res: { data: EventShortType }) => {
        dispatch(updateEventSlice(res.data))
      })
      .catch(() => console.log("Error deleting event"))
      .finally(() => {
        setUpdatingEvent(false)
        closeDrawer()
      })
  }

  const handleDeleteEvent = async () => {
    if (updatingEvent) return
    const confirmDelete = await confirm(
      "Are you sure you want to delete this event?",
      {
        title: "Delete Event",
        deleteButton: "Delete",
        cancelButton: "Cancel",
      },
    )
    if (confirmDelete === false) return

    setUpdatingEvent(true)
    deleteEvent(event._id)
      .then(() => {
        dispatch(deleteEventSlice(event._id))
      })
      .catch(() => console.log("Error deleting event"))
      .finally(() => setUpdatingEvent(false))
  }
  if (!user) return null

  return (
    <>
      <div className="py-2 pl-3 pr-2 flex flex-col text-left max-w-xl bg-white w-full border border-gray-300 rounded-lg shadow-sm">
        <div className="flex justify-between">
          <div className="pt-2 w-full">
            <div className="text-xs md:text-sm py-1 bg-blueShade font-poppins  gap-0.5 justify-center flex items-center  text-slate-900 font-medium md:font-normal px-3 rounded-lg">
              <CalendarDays className="inline mb-0.5" size={16} />
              &nbsp;
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </div>
            <div className="pt-2 text-gray-700 pl-2 mt-1">
              <div className="text-sm">Event Name</div>
              <div className="text-xl font-medium text-slate-700">
                {event.name}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`text-sm mb-2 ml-2 px-2 py-0.5 border rounded-full mt-2 w-fit  ${user.userId === event.host._id ? "text-rose-700 border-rose-700 " : " border-zinc-700 text-zinc-700"}`}
        >
          {asVendor
            ? "Providing Service"
            : user.userId === event.host._id
              ? "Hosted"
              : `Invited by ${event.host.name}`}
        </div>
        <div className="pl-1.5 mt-2  mr-3 flex justify-between">
          {user.userId === event.host._id && (
            <div className="flex gap-1 p-2">
              <SquarePen
                onClick={handleEditEvent}
                size={18}
                className="text-gray-700"
              />
              <Trash
                onClick={handleDeleteEvent}
                size={18}
                className="text-red-500"
              />
            </div>
          )}
          <div className="ml-auto">
            <ButtonSecondary
              text="View Event"
              onClick={() => navigate(`/events/${event._id}`)}
              icon={<ArrowRightToLine size={18} />}
            />
          </div>
        </div>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
        className="outline"
      >
        <Box className="!p-4  flex-col flex gap-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold  ">Edit Your Event</h2>
            <IconButton onClick={closeDrawer}>
              <X size={24} className="text-red-500" />
            </IconButton>
          </div>
          <label htmlFor="eventName">Event Name</label>
          <Input
            id="eventName"
            className="mb-3 ml-1"
            value={editedEvent.name}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, name: e.target.value })
            }
            placeholder="Event Name"
          />
          <label htmlFor="eventType">Event Type</label>
          <Select
            id="eventType"
            className="mb-3 ml-1"
            value={editedEvent.eventType}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, eventType: e.target.value })
            }
            size="small"
            displayEmpty
          >
            <MenuItem value="wedding">Wedding</MenuItem>
            <MenuItem value="conference">Conference</MenuItem>
            <MenuItem value="party">Party</MenuItem>
            <MenuItem value="concert">Concert</MenuItem>
          </Select>
          <DatePickerWithRange
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          <Button onClick={handleSaveEvent} text="Update Event" />
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default EventCard
