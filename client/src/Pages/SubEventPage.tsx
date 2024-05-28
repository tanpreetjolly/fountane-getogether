import { useState } from "react"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import { AddCircleOutline } from "@mui/icons-material"
import CreateChannelDrawer from "../components/CreateChannelDrawer"
import { useEventContext } from "../context/EventContext"
import Loader from "../components/Loader"
import {
  BookUser,
  CalendarDays,
  Group,
  HandPlatter,
  ListTodo,
  MapPin,
  Users,
  Volume2,
} from "lucide-react"
import { ChannelType } from "../definitions"
import { format } from "date-fns"

const lightShades = ["bg-zinc-700", "bg-slate-700", "bg-dark", "bg-fuchsia-700"]

const getChannelIcon = (channelName: string) => {
  switch (channelName) {
    case "Announcement":
      return <Volume2 size={18} />
    case "Vendors Only":
      return <HandPlatter size={18} />
    case "Guests Only":
      return <Users size={18} />
    default:
      return <Group size={18} />
  }
}

const Channel = ({ channel }: { channel: ChannelType }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate(`channels/${channel._id}`)
      }}
      className={`text-slate-900  w-full text-left px-5 mb-2 py-3 border border-slate-300 shadow-sm rounded-xl flex items-center gap-2`}
    >
      # {channel.name}
      {getChannelIcon(channel.name)}
    </button>
  )
}
const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}
const SubEventChannels = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // New state variable to track drawer type
  const { event, loadingEvent } = useEventContext()

  const navigate = useNavigate()
  const { subEventId } = useParams()

  const subEvent = event?.subEvents.find(
    (subEvent) => subEvent._id === subEventId,
  )

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setDrawerOpen(open)
  }

  if (loadingEvent) return <Loader />
  if (!event) return <div>Event Not Found</div>
  if (!subEvent) return <div>Sub Event Not Found</div>

  return (
    <div className="px-4 flex flex-col justify-between  h-[85vh] ">
      <div>
        <div className="flex flex-col items-start justify-between ">
          <div className="px-1">
            <div className="mb-1  text-2xl font-bold text-gray-800">
              {subEvent.name}
            </div>
            <div className="text-sm text-indigo-600 font-medium rounded-full flex items-center gap-1 mb-1 ">
              <CalendarDays className="inline mb-0.5" size={18} />
              {formatDate(subEvent.startDate)} - {formatDate(subEvent.endDate)}
            </div>
          </div>

          <div className="text-base text-slate-800  rounded-full  flex items-center gap-1 pl-1">
            <MapPin className="inline gap-1" size={16} />
            {subEvent.venue}
          </div>
        </div>
        <div className="flex justify-around gap-3 mb-1 mt-2 font-inter">
          <button
            onClick={() => navigate(`guests`)}
            className="flex items-center justify-around  bg-indigo-500 text-white rounded-lg w-1/2 px-4 py-3 gap-2"
          >
            <div>
              <div className="text-gray-100 text-sm text-left">Invite</div>
              <div className="font-semibold text-xl"> Guests</div>
            </div>
            <BookUser size={30} />
          </button>
          <button
            onClick={() => navigate(`vendors`)}
            className="flex items-center justify-around  bg-zinc-800 text-white  rounded-lg w-1/2 px-4 py-3 gap-4"
          >
            <div>
              <div className="text-zinc-100 text-left text-sm">Assign</div>
              <div className="font-semibold text-xl"> Vendors</div>
            </div>
            <ListTodo size={30} />
          </button>
        </div>
        <div className="mb-1.5 text-xl text-zinc-800 mt-4  pl-1 font-semibold">
          Text Channels
        </div>
        <div className="flex flex-col ">
          {subEvent.channels.map((channel) => (
            <Channel key={channel._id} channel={channel} />
          ))}
        </div>
      </div>
      <div className="mb-10">
        <Button
          text="Create Channel"
          onClick={() => setDrawerOpen(true)}
          icon={<AddCircleOutline />}
        />
      </div>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
      >
        <CreateChannelDrawer toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    </div>
  )
}

export default SubEventChannels
