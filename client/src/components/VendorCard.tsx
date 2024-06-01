import { useEffect, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Button from "./Button"
import { IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { VendorSaveType } from "@/definitions"
import { Link, useParams } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"
import toast from "react-hot-toast"
import { makeAOffer } from "@/api"

type Props = {
  vendor: VendorSaveType
}

const VendorCard = ({ vendor }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])

  const { event, loadingEvent, updateEvent } = useEventContext()

  const { subEventId } = useParams()

  useEffect(() => {
    if (!event) return
    if (!subEventId) return

    setSelectedFestivities([subEventId])
  }, [event, subEventId])

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const festivityList = event.subEvents

  const inviteVendor = () => {
    //invite vendor
    if (selectedFestivities.length === 0) {
      toast.error("Please select at least one festivity")
      return
    }
    toast.promise(
      makeAOffer(event._id, {
        vendorProfileId: vendor.vendorProfileId,
        subEventIds: selectedFestivities,
        serviceId: vendor.servicesOffering._id,
      }),
      {
        loading: "Sending Request...",
        success: (data) => {
          console.log(data)
          updateEvent()
          return "Offer Sent"
        },
        error: (error) => {
          console.log(error.response)
          return "Something went wrong!"
        },
      },
    )
    setIsDrawerOpen(false)
  }

  const handleFestivityChange = (festivity: string) => {
    setSelectedFestivities((prevFestivities) =>
      prevFestivities.includes(festivity)
        ? prevFestivities.filter((item) => item !== festivity)
        : [...prevFestivities, festivity],
    )
  }

  const handleInviteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawerOpen(true)
  }

  return (
    <>
      <button className="border p-5 rounded-lg w-full">
        <Link
          to={`/my-chats/${vendor.vendorProfileId}`}
          className="flex justify-between items-center"
        >
          <div className="text-left">
            <div className="text-lg mb-1 font-medium">
              {vendor.servicesOffering.serviceName} - $
              {vendor.servicesOffering.price}
            </div>
            <div className="text-base text-gray-700 capitalize italic">
              by {vendor.vendorName}
            </div>
            <div className="text-sm text-gray-700 capitalize">
              {vendor.servicesOffering.serviceDescription}
            </div>
          </div>
          <button
            className={`px-4 py-1.5 capitalize rounded-full`}
            onClick={handleInviteButtonClick}
          >
            Invite
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
            {vendor.vendorName}
          </span>
          <br />
          <span className="ml-2 text-sm text-gray-500">
            {vendor.servicesOffering.serviceName} - $
            {vendor.servicesOffering.price}
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
                <ListItemText primary={festivity.name} />
              </ListItem>
            ))}
          </List>
          <div>
            Total Price: $
            {(
              selectedFestivities.length * vendor.servicesOffering.price
            ).toFixed(2)}
          </div>
          <Button
            text="Make a Offer"
            onClick={inviteVendor}
            icon={<IoPersonAdd />}
          />
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
