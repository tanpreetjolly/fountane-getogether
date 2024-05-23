import { useState } from "react"
import { FaPeopleCarry } from "react-icons/fa"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { BsFillPeopleFill } from "react-icons/bs"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import { AddCircleOutline } from "@mui/icons-material"
import CreateChannelDrawer from "../components/CreateChannelDrawer"

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
]

const lightShades = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-cyan-600",
  "bg-yellow-600",
  "bg-purple-600",
]

const Channel = ({ name, colorIndex, id }: any) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate(`channels/${id}`)
      }}
      className={`text-gray-100 w-full text-left px-3 mb-3 py-2.5 text-lg font-medium ${lightShades[colorIndex]} rounded-lg`}
    >
      {name}
    </button>
  )
}

const SubEventChannels = () => {
  const navigate = useNavigate()
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
  // const {id, subEventId} = useParams()

  return (
    <div className="px-4 flex flex-col justify-between h-full min-h-[90vh] pb-8">
      <div>
        <div className="flex justify-around gap-3 mb-1">
          <button
            onClick={() => navigate(`invite-guests`)}
            className="flex items-center justify-around bg-teal-500 text-white rounded-md w-1/2 px-4 py-3 gap-4"
          >
            <div>
              <div className="text-gray-100 ">Invite</div>
              <div className="font-bold text-xl"> Guests</div>
            </div>
            <BsFillPeopleFill className="text-3xl" />
          </button>
          <button
            onClick={() => navigate(`assign-vendors`)}
            className="flex items-center justify-around bg-indigo-500 text-white border rounded-md w-1/2 px-4 py-3 gap-4"
          >
            <div>
              <div className="text-gray-100 ">Assign</div>
              <div className="font-bold text-xl"> Vendors</div>
            </div>
            <FaPeopleCarry className="text-4xl" />
          </button>
        </div>
        <div className="p-1 text-lg text-gray-600 mb-1">Text Channels</div>
        <div className="flex flex-col">
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
