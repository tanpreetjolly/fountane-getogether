import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "./Button"
import { IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"

type Props = {
  vendor: {
    id: string
    name: string
    type: string
    status: string
    events: string[]
  }
  onClick?: () => void
}

const VendorCard = (props: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [festivities, setFestivities] = useState<string[]>([])

  const getStatusColor = () => {
    switch (props.vendor.status) {
      case "hired":
        return "bg-green-400 text-white "
      case "invited":
        return "bg-blue-400 text-white "
      case "invite":
        return "bg-yellow-300 text-gray-800"
      default:
        return ""
    }
  }

  const inviteVendor = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleFestivityChange = (festivity: string) => {
    setFestivities((prevFestivities) =>
      prevFestivities.includes(festivity)
        ? prevFestivities.filter((item) => item !== festivity)
        : [...prevFestivities, festivity],
    )
  }

  const festivityList = [
    "Wedding",
    "Birthday",
    "Anniversary",
    "Corporate Event",
  ]

  return (
    <>
      <button onClick={props.onClick} className="border p-5 rounded-lg w-full">
        {/* vendor status - hired, invited, invite */}
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="text-lg mb-1 font-medium text-gray-700">
              {props.vendor.name}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              Type : {props.vendor.type}
            </div>
            {/* Vendor Events .map */}
            <div className="text-sm text-gray-500">
              Events :{" "}
              {props.vendor.events.map((event) => (
                <span key={event} className="capitalize">
                  {event},{" "}
                </span>
              ))}
            </div>
          </div>
          <div
            className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor()}`}
            onClick={() => {
              if (props.vendor.status === "invite") inviteVendor()
            }}
          >
            {props.vendor.status}
          </div>
        </div>
      </button>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box sx={{ p: 2 }}>
          {/* List to select festivities to invite to vendor */}
          <span className="pl-4 text-xl text-gray-800 font-medium">
            Select the Festivities for RSVP
          </span>
          <List>
            {festivityList.map((festivity) => (
              <ListItem
                key={festivity}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    color="secondary"
                    checked={festivities.includes(festivity)}
                    onChange={() => handleFestivityChange(festivity)}
                  />
                }
              >
                <ListItemText primary={festivity} />
              </ListItem>
            ))}
          </List>
          <Button text="Invite" onClick={inviteVendor} icon={<IoPersonAdd />} />
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
