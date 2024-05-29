import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "./Button"
import { IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { OtherUserType, ServiceType, SubEventType } from "@/definitions"
import { useNavigate } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"

type Props = {
  vendor: {
    subEvent?: Omit<SubEventType, "channels">
    vendor: OtherUserType
    status?: string
    servicesOffering?: [string]
    services?: ServiceType[]
  }
}

const VendorCard = ({ vendor }: Props) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const navigate = useNavigate()

  const { event, loadingEvent } = useEventContext()

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const festivityList = event.subEvents
  const vendorList = event.vendorList

  const vendorSelected = vendorList.find(
    (vendor) => vendor.vendor.user._id === selectedVendorId,
  )

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
    //invite vendor
    setSelectedVendorId(null)
    setIsDrawerOpen(false)
  }

  const handleFestivityChange = (festivity: string) => {
    setSelectedFestivities((prevFestivities) =>
      prevFestivities.includes(festivity)
        ? prevFestivities.filter((item) => item !== festivity)
        : [...prevFestivities, festivity],
    )
  }

  return (
    <>
      <button className="border p-5 rounded-lg w-full">
        {/* vendor status - hired, invited, invite */}
        <div
          className="flex justify-between items-center"
          onClick={() => {
            if (vendor.status) navigate(`${vendor.vendor._id}/chat`)
          }}
        >
          <div className="text-left">
            <div className="text-lg mb-1 font-medium text-gray-700">
              {vendor.vendor.name}
            </div>
            {vendor.servicesOffering && (
              <div className="text-sm text-gray-500 capitalize">
                Type :{" "}
                {vendor.servicesOffering.map((service) => (
                  <span key={service}>{service}, </span>
                ))}
              </div>
            )}
            {vendor.services && (
              <div className="text-sm text-gray-500 capitalize">
                Type :{" "}
                {vendor.services.map((service) => (
                  <span key={service._id}>{service.serviceName}, </span>
                ))}
              </div>
            )}

            {vendor.subEvent && (
              <div className="text-sm text-gray-500">
                Sub-Events :{" "}
                <span className="capitalize">{vendor.subEvent.name}</span>
              </div>
            )}
          </div>
          <div
            className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor()}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedVendorId(vendor.vendor._id)
              setIsDrawerOpen(true)
              setSelectedFestivities(
                vendorSelected?.subEvents.map(
                  (subEvent) => subEvent.subEvent._id,
                ) || [],
              )
            }}
          >
            {vendor.status || "Invite"}
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
          {vendor.services && (
            <List>
              {vendor.services.map((service) => (
                <ListItem
                  key={service._id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      color="secondary"
                      checked={selectedServices.includes(service._id)}
                      onChange={() => {
                        setSelectedServices((prevServices) =>
                          prevServices.includes(service._id)
                            ? prevServices.filter(
                                (item) => item !== service._id,
                              )
                            : [...prevServices, service._id],
                        )
                      }}
                    />
                  }
                >
                  <ListItemText
                    primary={service.serviceName}
                    secondary={
                      service.serviceDescription + " - $" + service.price
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <List>
            {festivityList.map((festivity) => (
              <ListItem
                key={festivity._id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    color="secondary"
                    checked={selectedFestivities.includes(festivity._id)}
                    onChange={() => handleFestivityChange(festivity._id)}
                  />
                }
              >
                <ListItemText primary={festivity.name} />
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
