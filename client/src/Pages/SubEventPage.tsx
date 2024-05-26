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
import { SubEvent } from "../definitions"
import { format } from "date-fns"

const channelData = [
  {
    id: "1",
    name: "Announcements",
  },
  {
    id: "2",
    name: "Vendors Only",
  },
  {
    id: "3",
    name: "Guest Only",
  },
  {
    id: "4",
    name: "Photo Sharing",
  },
]

const lightShades = ["bg-zinc-700", "bg-slate-700", "bg-dark", "bg-fuchsia-700"]

const getChannelIcon = (channelName: string) => {
  switch (channelName) {
    case "Announcements":
      return <Volume2 size={18} />
    case "Vendors Only":
      return <HandPlatter size={18} />
    case "Guest Only":
      return <Users size={18} />
    default:
      return <Group size={18} />
  }
}

const Channel = ({ name,id }: any) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate(`channels/${id}`)
      }}
      className={`text-slate-900  w-full text-left px-5 mb-2 py-3 border border-slate-300 shadow-sm rounded-xl flex items-center gap-2`}
    >
      # {name}
      {getChannelIcon(name)}
    </button>
  )
}
const SubEventChannels = () => {
  const navigate = useNavigate()
  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy")
  }
  const { event, loadingEvent } = useEventContext()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // New state variable to track drawer type
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
  const { subEventId } = useParams()

  const subEvent = event?.subEvents?.find(
    (subEvent: SubEvent) => subEvent._id === subEventId,
  )

  if (loadingEvent) return <Loader />

  return (
    <div className="px-4 flex flex-col justify-between  h-[85vh] ">
      <div className="">
        {subEvent && (
          <div className="flex flex-col items-start justify-between ">
            <div className="px-1">
              <div className="mb-1  text-2xl font-bold text-gray-800">
                {subEvent.name}
              </div>
              <div className="text-sm text-indigo-600 font-medium rounded-full flex items-center gap-1 mb-1 ">
                <CalendarDays className="inline mb-0.5" size={18} />
                {formatDate(subEvent.startDate)} -{" "}
                {formatDate(subEvent.endDate)}
              </div>
            </div>

            <div className="text-base text-slate-800  rounded-full  flex items-center gap-1 pl-1">
            <MapPin className="inline gap-1" size={16} />
              {subEvent.venue}
            </div>
          </div>
        )}
        <div className="flex justify-around gap-3 mb-1 mt-2 font-inter">
          <button
            onClick={() => navigate(`invite-guests`)}
            className="flex items-center justify-around  bg-indigo-500 text-white rounded-lg w-1/2 px-4 py-3 gap-2"
          >
            <div>
              <div className="text-gray-100 text-sm text-left">Invite</div>
              <div className="font-semibold text-xl"> Guests</div>
            </div>
            <BookUser size={30} />
          </button>
          <button
            onClick={() => navigate(`assign-vendors`)}
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
          {channelData?.map((channel, index) => (
            <Channel
              key={channel.id}
              name={channel.name}
              id={channel.id}
              colorIndex={index % lightShades.length}
            />
          ))}
        </div>
      </div>

      <Button
        text="Create Channel"
        onClick={() => setDrawerOpen(true)}
        icon={<AddCircleOutline />}
      />

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
