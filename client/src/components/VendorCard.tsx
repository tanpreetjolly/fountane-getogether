import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "./Button"
import { IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { OtherUserType, SubEventType } from "@/definitions"
import { useNavigate } from "react-router-dom"

type Props = {
  vendor: {
    subEvent: Omit<SubEventType, "channels">
    vendor: OtherUserType
    status: string
    servicesOffering: [string]
  }
}

const VendorCard = ({ vendor }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [festivities, setFestivities] = useState<string[]>([])

  const navigate = useNavigate()

  const getStatusColor = () => {
    switch (vendor.status) {
      case "hired":
        return "bg-green-400 text-white "
      case "invited":
        return "bg-blue-400 text-white "
      case "rejected":
        return "bg-red-600 text-gray-300"
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
      <button
        onClick={() => {
          navigate(`${vendor.vendor._id}/chat`)
        }}
        className="border p-5 rounded-lg w-full"
      >
        {/* vendor status - hired, invited, invite */}
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="text-lg mb-1 font-medium text-gray-700">
              {vendor.vendor.name}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              Type :{" "}
              {vendor.servicesOffering.map((service) => (
                <span key={service}>{service}, </span>
              ))}
            </div>
            {/* Vendor Events .map */}
            <div className="text-sm text-gray-500">
              Sub-Events :{" "}
              <span className="capitalize">{vendor.subEvent.name}</span>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor()}`}
            onClick={() => {
              if (vendor.status === "invite") inviteVendor()
            }}
          >
            {vendor.status}
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
