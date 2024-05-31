import { useEffect, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "./Button"
import { IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { OtherUserType, ServiceType, SubEventsVendorType } from "@/definitions"
import { Link } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"

type Props = {
  vendor: {
    vendor: OtherUserType
    servicesOffering: ServiceType
    status?: string
    subEvent?: Omit<SubEventsVendorType, "channels">
  }
}

const VendorCard = ({ vendor }: Props) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])

  const { event, loadingEvent } = useEventContext()

  // useEffect(() => {
  //   if (!event) return

  //   // if current vendor is already invited, set the selected festivity
  //   const selectedSubEvents = event.vendorList
  //     .find((v) => v.vendorProfile.user._id === vendor.vendor._id)
  //     ?.subEvents.filter(
  //       (subEvent) =>
  //         subEvent.servicesOffering._id === vendor.servicesOffering._id,
  //     )
  //     .map((subEvent) => subEvent.subEvent._id)

  //   console.log(selectedSubEvents)

  //   setSelectedFestivities(selectedSubEvents || [])
  // }, [event, vendor])

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const festivityList = event.subEvents
  const vendorList = event.vendorList

  const vendorSelected = vendorList.find(
    (vendor) => vendor.vendorProfile.user._id === selectedVendorId,
  )

  const getStatusColor = () => {
    switch (vendor.status) {
      case "accepted":
        return "bg-green-400 text-white "
      case "pending":
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

  const handleStatusButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedFestivities(
      vendorSelected?.subEvents.map((subEvent) => subEvent.subEvent._id) || [],
    )
    setSelectedVendorId(vendor.vendor._id)
    setIsDrawerOpen(true)
  }

  const getStatus = (subEventID: string) => {
    return vendorSelected?.subEvents.find(
      (subEvent) => subEvent.subEvent._id === subEventID,
    )?.status
  }

  return (
    <>
      <button className="border p-5 rounded-lg w-full">
        <Link
          to={`${vendor.vendor._id}/chat`}
          className="flex justify-between items-center"
        >
          <div className="text-left">
            <div className="text-lg mb-1 font-medium">
              {vendor.servicesOffering.serviceName} - $
              {vendor.subEvent?.amount || vendor.servicesOffering.price}
            </div>
            <div className="text-base  text-gray-700 capitalize italic">
              {vendor.vendor.name}
            </div>
            {!vendor.status && (
              <div className="text-sm text-gray-500 capitalize">
                {vendor.servicesOffering.serviceDescription}
              </div>
            )}

            {vendor.subEvent && (
              <div className="text-sm text-gray-500">
                Sub-Events :{" "}
                <span className="capitalize">
                  {vendor.subEvent.subEvent.name}
                </span>
              </div>
            )}
          </div>
          <button
            className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor()}`}
            onClick={handleStatusButtonClick}
          >
            {vendor.status || "Invite"}
          </button>
        </Link>
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
          <span className="text-lg text-gray-800 font-medium">
            {vendor.vendor.name}
          </span>
          <br />
          <span className="ml-2 text-sm text-gray-500">
            {vendor.servicesOffering.serviceName} - $
            {vendor.subEvent?.amount || vendor.servicesOffering.price}
          </span>
          <br />
          <span className="text-sm text-gray-500">
            {vendor.servicesOffering.serviceDescription}
          </span>

          {festivityList.length === 0 && (
            <div className="text-center text-gray-500">
              No Festivities Found, Create Festivities
            </div>
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
                <ListItemText
                  primary={festivity.name}
                  secondary={
                    <span className="capitalize">
                      {getStatus(festivity._id)}
                    </span>
                  }
                />
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
