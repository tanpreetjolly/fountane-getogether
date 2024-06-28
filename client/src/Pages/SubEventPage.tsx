import { useState } from "react"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import CreateChannelDrawer from "../components/CreateChannelDrawer"
import { useEventContext } from "../context/EventContext"
import Loader from "../components/Loader"
import {
  ArrowRightToLine,
  CalendarDays,
  ContactRound,
  Group,
  HandPlatter,
  ListTodo,
  MapPin,
  PlusCircleIcon,
  Users,
  Volume2,
} from "lucide-react"
import { ChannelType } from "../definitions"
import { format } from "date-fns"
import { useAppSelector } from "@/hooks"
import ButtonSecondary from "@/components/ButtonSecondary"

const getChannelIcon = (channelType: string) => {
  switch (channelType) {
    case "announcement":
      return <Volume2 size={20} />
    case "vendorsOnly":
      return <HandPlatter size={20} />
    case "guestsOnly":
      return <Users size={20} />
    default:
      return <Group size={20} />
  }
}

const getChannelDescription = (channelType: string) => {
  switch (channelType) {
    case "announcement":
      return (
        <div className="text-sm text-gray-700">
          Public Announcements Channel
        </div>
      )
    case "vendorsOnly":
      return (
        <div className="text-sm text-gray-700">
          Discussion channels for to vendors and the host
        </div>
      )
    case "guestsOnly":
      return <div className="text-sm text-gray-700">Discussions for guests</div>
    default:
      return (
        <div className="text-sm text-gray-700">
          Custom Channel for Discussion
        </div>
      )
  }
}

const Channel = ({ channel }: { channel: ChannelType }) => {
  const navigate = useNavigate()
  const channelIcon = getChannelIcon(channel.type)
  const channelDescription = getChannelDescription(channel.type)

  return (
    <button
      className={`text-slate-800  border-slate-300 bg-gray-50 w-full text-left px-5 mb-2 pt-4 border shadow-sm rounded-2xl flex flex-col justify-between `}
    >
      <span className="text-base font-medium flex items-center gap-2">
        #{channel.name} {channelIcon}
      </span>
      <div className="flex items-center gap-1">{channelDescription}</div>
      <div className="ml-auto flex items-center mt-4">
        <ButtonSecondary
          backgroundColor="bg-blueShade"
          onClick={() => {
            navigate(`channel/${channel._id}`)
          }}
          text="View Channel"
          fontSize="text-xs md:text-sm"
          icon={<ArrowRightToLine size={18} />}
        />
      </div>
    </button>
  )
}
const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}
const SubEventChannels = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // New state variable to track drawer type
  const { event, loadingEvent } = useEventContext()
  const { user } = useAppSelector((state) => state.user)

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
  if (!user) return <div>User Not Found</div>

  return (
    <div className="px-4 flex flex-col justify-between  min-h-[65vh] lg:w-5/6 mx-auto py-2">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center  bg-white rounded-2xl p-5 py-6  border shadow-sm w-full justify-between">
          <div className="flex flex-col items-start">
            <div className="">
              <div className="text-[13px] bg-blueShade px-3 py-1 text-slate-800   rounded-lg flex items-center gap-1 mb-1 ">
                <CalendarDays className="inline mb-0.5" size={15} />
                {formatDate(subEvent.startDate)} -{" "}
                {formatDate(subEvent.endDate)}
              </div>
              <div className="mt-2 pl-1 text-xl md:text-2xl  font-medium text-slate-700">
                {subEvent.name}
              </div>
              <div className="pl-1 mb-3 text-slate-600 ">
                in <span className="font-medium">{event.name}</span>
              </div>
            </div>

            <div className="text-[13px] text-slate-900  bg-yellowShade px-3 py-0.5  rounded-lg  flex items-center gap-1 ">
              {subEvent.venue}
              <MapPin className="inline gap-1" size={14} />
            </div>
          </div>
          {event.isHosted && (
            <div className="flex justify-around gap-1.5 mb-1 mt-4 md:mt-2  lg:w-[28%]">
              <button
                onClick={() => navigate(`guests`)}
                className="flex  items-center  justify-around bg-purpleShade aspect-[1.6] bg-opacity-85    text-zinc-800  rounded-2xl w-[48%] px-4 py-4 gap-3"
              >
                <div>
                  <div className="text-slate-800 text-sm text-left">Invite</div>
                  <div className="font-medium text-slate-800 text-xl">
                    {" "}
                    Guests
                  </div>
                </div>
                <ContactRound size={28} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate(`vendors`)}
                className="flex  items-center  justify-around bg-dark bg-opacity-90  text-gray-50  rounded-2xl w-[48%] px-4 py-4 gap-3 "
              >
                <div>
                  <div className="text-zinc-100 text-left text-sm">Assign</div>
                  <div className="font-medium text-xl"> Vendors</div>
                </div>
                <ListTodo size={30} />
              </button>
            </div>
          )}
          {!event.isHosted &&
            event.isVendor?.some(
              (service) => service.subEvent._id === subEvent._id,
            ) && (
              <div className="flex justify-around gap-2 mb-1 mt-2  lg:w-[25%]">
                <button
                  onClick={() => navigate(`vendors`)}
                  className="flex  items-center  justify-around bg-dark bg-opacity-90  text-gray-50  rounded-2xl w-1/2 px-4 py-4 gap-3"
                >
                  <div>
                    <div className="text-zinc-100 text-left text-sm">View</div>
                    <div className="font-medium text-xl"> Vendors</div>
                  </div>
                  <ListTodo size={30} />
                </button>
              </div>
            )}
        </div>

        <div className="bg-white p-5 mt-4 rounded-2xl shadow-sm border">
          <div className="flex  border-b mb-2 justify-between items-center pb-2">
            <div className="text-sm md:text-lg  text-zinc-700  pl-1 font-medium">
              Text Channels
            </div>
            <div className="md:hidden">
              {event.isHosted && (
                <Button
                  text=" Channel"
                  onClick={() => setDrawerOpen(true)}
                  icon={<PlusCircleIcon size={18} />}
                  fontSize="text-sm md:text-base"
                />
              )}
            </div>
            <div className="hidden md:block">
              {event.isHosted && (
                <Button
                  text="Create Channel"
                  onClick={() => setDrawerOpen(true)}
                  icon={<PlusCircleIcon size={18} />}
                  fontSize="text-sm md:text-base"
                />
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 ">
            {subEvent.channels.map((channel) => (
              <Channel key={channel._id} channel={channel} />
            ))}
          </div>
        </div>
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
