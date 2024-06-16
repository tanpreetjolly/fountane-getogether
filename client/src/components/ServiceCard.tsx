import { ServiceListType } from "@/definitions"
import { Link } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"
import { useState } from "react"
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material"
import { SaveAllIcon, SquarePen, Trash } from "lucide-react"
import Button from "./Button"
import { Cross1Icon } from "@radix-ui/react-icons"

type Props = {
  service: ServiceListType
}

const VendorCard = ({ service }: Props) => {
  const { event, loadingEvent } = useEventContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  const festivityList = event.subEvents
  const getStatusColor = () => {
    switch (service.status) {
      case "accepted":
        return "bg-teal-400 text-white "
      case "pending":
        return "bg-indigo-400 text-white "
      case "rejected":
        return "bg-rose-500 text-white"
      default:
        return ""
    }
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
    setSelectedFestivities([service.subEvent._id])
    setIsDrawerOpen(true)
  }
  return (
    <>
      <button className="border p-5 rounded-lg w-full relative">
        {event.isHosted && (
          <div className="flex gap-1 p-2 absolute right-1 top-1 ">
            <button onClick={handleInviteButtonClick}>
              <SquarePen size={18} className="text-gray-700" />
            </button>
            <Trash size={18} className="text-red-500" />
          </div>
        )}
        <Link
          to={`/my-chats/${service.vendorProfile.user._id}`}
          className="flex justify-between items-center"
        >
          <div className="text-left">
            <div className="text-lg mb-1 font-medium">
              {service.servicesOffering.serviceName} - ${service.amount}
            </div>
            <div className="text-base text-gray-500">
              Sub-Event:{" "}
              <span className="capitalize">{service.subEvent.name}</span>
            </div>
            <div className="text-sm  text-gray-700 capitalize">
              {service.vendorProfile.user.name}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              {service.servicesOffering.serviceDescription}
            </div>
          </div>
          <div
            className={`px-3 py-1 capitalize rounded-full ${getStatusColor()}`}
          >
            {service.status === "accepted"
              ? "Hired"
              : service.status || "Invite"}
          </div>
        </Link>
      </button>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <div className=" p-4 space-y-1">
          {/* close icon */}
          <div className="flex justify-end">
            <button onClick={() => setIsDrawerOpen(false)}>
              <Cross1Icon className="text-gray-700" />
            </button>
          </div>
          {/* List to select festivities to invite to vendor */}
          <span className=" text-xl text-gray-800 font-medium ">
            Select the Festivities for RSVP
          </span>
          <span className="text-lg text-gray-800 font-medium">
            {service.vendorProfile.user.name}
          </span>
          <br />
          <span className="text-base text-gray-500 m">
            {service.servicesOffering.serviceName} - $
            {service.servicesOffering.price}
          </span>
          <br />
          <span className="text-sm text-gray-500">
            {service.servicesOffering.serviceDescription}
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
                    checked={selectedFestivities.includes(festivity._id)}
                    onChange={() => handleFestivityChange(festivity._id)}
                  />
                }
              >
                <ListItemText primary={festivity.name} />
              </ListItem>
            ))}
          </List>
          <div className="space-y-2">
            {service.servicesOffering.items.map((item, index) => (
              <div key={item._id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">
                    {index + 1 + ". " + item.name}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="py-3 px-2 text-xl font-medium text-slate-700 border my-2">
            Total Amount: $
            {(
              selectedFestivities.length * service.servicesOffering.price
            ).toFixed(2)}
          </div>
          <Button
            text="Make a Offer"
            onClick={() => {}}
            icon={<SaveAllIcon />}
          />
        </div>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
