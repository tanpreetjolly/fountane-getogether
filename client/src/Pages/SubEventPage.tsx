import { useState } from "react"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import { AddCircleOutline } from "@mui/icons-material"
import CreateChannelDrawer from "../components/CreateChannelDrawer"
import { useEventContext } from "../context/EventContext"
import Loader from "../components/Loader"
import {
  ArrowRightToLine,
  BookUser,
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

const getChannelIcon = (channelName: string) => {
  switch (channelName) {
    case "Announcement":
      return <Volume2 size={20} />
    case "Vendors Only":
      return <HandPlatter size={20} />
    case "Guests Only":
      return <Users size={20} />
    default:
      return <Group size={20} />
  }
}

const getChannelDescription = (channelName: string) => {
  switch (channelName) {
    case "Announcement":
      return (
        <div className="text-sm text-gray-700">
          Public Announcements Channel
        </div>
      )
    case "Vendors Only":
      return (
        <div className="text-sm text-gray-700">
          Discussion channels for to vendors and the host
        </div>
      )
    case "Guests Only":
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
  const channelIcon = getChannelIcon(channel.name)
  const channelDescription = getChannelDescription(channel.name)

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

  const isHost = user.userId === event.host._id
  const isGuest = event.userList.some((guest) => guest.user._id === user.userId)
  const isVendor = event.serviceList.some(
    (service) => service.vendorProfile.user._id === user.userId,
  )

  console.log({ isHost, isGuest, isVendor })

  return (
    <div className="px-4 flex flex-col justify-between  h-[85vh] lg:w-5/6 mx-auto py-2">
      <div>
        <div className="flex items-center  bg-white rounded-2xl p-5 py-6  border shadow-sm w-full justify-between">
          <div className="flex flex-col items-start">
            <div className="">
              <div className="text-[13px] bg-blueShade px-3 py-1 text-slate-800   rounded-lg flex items-center gap-1 mb-1 ">
                <CalendarDays className="inline mb-0.5" size={15} />
                {formatDate(subEvent.startDate)} -{" "}
                {formatDate(subEvent.endDate)}
              </div>
              <div className="mt-2 pl-1 text-2xl  font-medium text-slate-700">
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
          {isHost && (
            <div className="flex justify-around gap-2 mb-1 mt-2  md:w-[25%]">
              <button
                onClick={() => navigate(`guests`)}
                className="flex  items-center  justify-around bg-purpleShade aspect-[1.6] bg-opacity-85    text-zinc-800  rounded-2xl w-1/2 px-4 py-4 gap-3"
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
                className="flex  items-center  justify-around bg-dark bg-opacity-90  text-gray-50  rounded-2xl w-1/2 px-4 py-4 gap-3"
              >
                <div>
                  <div className="text-zinc-100 text-left text-sm">Assign</div>
                  <div className="font-medium text-xl"> Vendors</div>
                </div>
                <ListTodo size={30} />
              </button>
            </div>
          )}
        </div>
        {isHost && (
          <div className="flex md:hidden justify-around gap-3 mb-1 mt-2  md:w-[30%]">
            <button
              onClick={() => navigate(`guests`)}
              className="flex  items-center  justify-around border aspect-[2] border-slate-800  text-slate-800  rounded-3xl w-1/2 px-4 py-4 gap-3"
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
        )}
        <div className="bg-white p-5 mt-4 rounded-2xl shadow-sm border">
          <div className="flex border-b mb-2 justify-between items-center pb-2">
            <div className="text-lg  text-zinc-700  pl-1 font-medium">
              Text Channels
            </div>

            <Button
              text="Create Channel"
              onClick={() => setDrawerOpen(true)}
              icon={<PlusCircleIcon size={18} />}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 ">
            {subEvent.channels
              .filter((channel) => {
                if (isHost) return true
                if (channel.name.toLowerCase() === "vendors only" && !isVendor)
                  return false
                if (channel.name.toLowerCase() === "guests only" && !isGuest)
                  return false
                return true
              })
              .map((channel) => (
                <Channel key={channel._id} channel={channel} />
              ))}
          </div>
        </div>
      </div>
      <div className="flex md:hidden justify-center gap-2 items-center fixed w-full backdrop-blur-md  py-4 px-4 left-1/2 translate-x-[-50%] bottom-14">
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
