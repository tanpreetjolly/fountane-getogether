// import { useState } from "react"
import { useNavigate } from "react-router-dom"
// import { FaPeopleCarry } from "react-icons/fa"
// import Button from "../components/Button"
// import { BsFillPeopleFill } from "react-icons/bs"
// import SwipeableDrawer from "@mui/material/SwipeableDrawer"
// import { AddCircleOutline } from "@mui/icons-material"
// import CreateChannelDrawer from "../components/CreateChannelDrawer"

const channelData = [
  {
    id: "1",
    name: "Announcements",
  },
  {
    id: "2",
    name: "Vendors Only",
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
        navigate(`channel/${id}`)
      }}
      className={`text-gray-100 w-full text-left px-3 mb-3 py-2.5 text-lg font-medium ${lightShades[colorIndex]} rounded-lg`}
    >
      {name}
    </button>
  )
}

const VendorChannels = () => {
  // const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // New state variable to track drawer type
  // const toggleDrawer = (open: boolean) => (event: any) => {
  //   if (
  //     event &&
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return
  //   }

  //   setDrawerOpen(open)
  // }

  return (
    <div className="px-4 flex flex-col justify-between h-full min-h-[90vh] pb-8">
      <div>
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
    </div>
  )
}

export default VendorChannels
