import { ServiceListType } from "@/definitions"
import { useNavigate } from "react-router-dom"
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
import { ArrowRight, SaveAllIcon, SquarePen } from "lucide-react"
import Button from "./Button"
import { Cross1Icon } from "@radix-ui/react-icons"
import ButtonSecondary from "./ButtonSecondary"

type Props = {
  service: ServiceListType
}

const VendorCard = ({ service }: Props) => {
  const { event, loadingEvent } = useEventContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])
  const navigate = useNavigate()
  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  const festivityList = event.subEvents
  const getStatusColor = () => {
    switch (service.status) {
      case "accepted":
        return "bg-green-200 text-green-800  "
      case "pending":
        return "bg-yellow-200 text-yellow-800 text-white "
      case "rejected":
        return "bg-red-200 text-red-800"
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
            {/* <Trash size={18} className="text-red-500" /> */}
          </div>
        )}
        <div
          className="flex flex-col justify-center"
        >
          <div className="text-left">
            <div className="text-sm text-slate-800 bg-sky-200 w-fit -ml-1 mb-1 px-3 rounded-lg">
              <span className="capitalize">{service.subEvent.name}</span>
            </div>
            <div className="text-lg  font-medium">
              {service.servicesOffering.serviceName} - ${service.amount}
            </div>
            <div className="text-sm  text-gray-700 mb-2">
              by {service.vendorProfile.user.name}
            </div>
            {/* <div className="text-sm text-gray-500 capitalize">
              {service.servicesOffering.serviceDescription}
            </div> */}
          </div>
          <div className=" flex justify-between items-start mt-4">
            <div
              className={`px-2.5  -mx-1 py-0.5 capitalize rounded-full w-fit text-sm ${getStatusColor()}`}
            >
              {service.status === "accepted"
                ? "Hired"
                : service.status || "Invite"}
            </div>
        <ButtonSecondary
          text="Contact"
          backgroundColor="bg-gray-300"
          icon={<ArrowRight size={20} strokeWidth={1.5}/>}
          onClick={() => {
            navigate(`/my-chats/${service.vendorProfile.user._id}`)
          }}
        />
          </div>
        </div>
      </button>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <div className=" p-4 space-y-1">
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
