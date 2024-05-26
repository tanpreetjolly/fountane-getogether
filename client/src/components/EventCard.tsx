import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { FC, useState } from "react"
import { EventShort } from "../definitions"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import {
  ArrowRightToLine,
  SquarePen,
  Trash,
} from "lucide-react"
import ButtonSecondary from "./ButtonSecondary"

interface EventCardProps {
  event: EventShort
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editedEvent, setEditedEvent] = useState<EventShort>(event)

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
    // Implement your logic to save the edited event
    console.log("Edited Event:", editedEvent)
    closeDrawer()
  }

  return (
    <>
      <div className="py-2 pl-3 pr-2   flex flex-col   text-left bg-white w-full border border-gray-300  rounded-lg shadow-sm ">
        <div className="flex  justify-between ">
          <div className="pt-2">
            <span className="text-xs ml-0.5 bg-indigo-400 w-fit text-white font-medium px-3 rounded-full py-1 ">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            <div className="pt-2 text-gray-700 w-1/2 pl-2 mt-2">
              <div className="text-sm">Event Name</div>
              <div className="text-2xl font-semibold text-gray-700">
                {event.name}
              </div>
            </div>
          </div>
          <div className="flex gap-1 p-2">
            <SquarePen
              onClick={handleEditEvent}
              size={18}
              className="text-gray-700"
            />
            <Trash onClick={() => {}} size={18} className="text-red-500" />
          </div>
        </div>
        <div className="text-base text-gray-700 mb-2 pl-2 mt-1">
          Event Host :{" "}
          <span className="font-medium text-dark ">{event.host.name}</span>
        </div>
        <div className="pl-1.5 mt-2">
          <ButtonSecondary
            text="View Event"
            onClick={() => navigate(`/events/${event._id}`)}
            icon={<ArrowRightToLine absoluteStrokeWidth size={18} />}
          />
        </div>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            label="Event Name"
            value={editedEvent.name}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Host"
            value={editedEvent.host.name}
            onChange={(e) =>
              setEditedEvent({
                ...editedEvent,
                host: { ...editedEvent.host, name: e.target.value },
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={editedEvent.startDate}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, startDate: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={editedEvent.endDate}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, endDate: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleSaveEvent} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default EventCard
