import { useEffect, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Button from "./Button"
import { IoClose, IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { VendorSaveType } from "@/definitions"
import { useParams } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"
import toast from "react-hot-toast"
import ButtonSecondary from "./ButtonSecondary"

type Props = {
  vendor: VendorSaveType
}

const VendorCard = ({ vendor }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<
    { subEventId: string; itemIds: string[] }[]
  >([])
  const { event, loadingEvent } = useEventContext()
  const { subEventId } = useParams()

  useEffect(() => {
    if (!event) return
    if (!subEventId) return

    setSelectedFestivities([{ subEventId, itemIds: [] }])
  }, [event, subEventId])

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const festivityList = event.subEvents

  const inviteVendor = () => {
    if (selectedFestivities.length === 0) {
      toast.error("Please select at least one festivity and item")
      return
    }

    // You can use the selectedFestivities array to send the offer with the selected festivity IDs and item IDs
    console.log(selectedFestivities)

    setIsDrawerOpen(false)
  }

  const calculateTotalPrice = (
    selectedFestivities: { subEventId: string; itemIds: string[] }[],
    basePrice: number,
  ) => {
    return selectedFestivities.reduce(
      (total, festivity) => total + basePrice * festivity.itemIds.length,
      0,
    )
  }

  const handleFestivityChange = (festivityId: string) => {
    setSelectedFestivities((prevFestivities) => {
      const existingFestivity = prevFestivities.find(
        (festivity) => festivity.subEventId === festivityId,
      )

      if (existingFestivity) {
        return prevFestivities.filter(
          (festivity) => festivity.subEventId !== festivityId,
        )
      } else {
        return [...prevFestivities, { subEventId: festivityId, itemIds: [] }]
      }
    })
  }

  const handleInviteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawerOpen(true)
  }

  const handleItemChange = (festivityId: string, itemId: string) => {
    setSelectedFestivities((prevFestivities) => {
      const updatedFestivities = prevFestivities.map((festivity) => {
        if (festivity.subEventId === festivityId) {
          const updatedItemIds = festivity.itemIds.includes(itemId)
            ? festivity.itemIds.filter((id) => id !== itemId)
            : [...festivity.itemIds, itemId]
          return { ...festivity, itemIds: updatedItemIds }
        }
        return festivity
      })
      return updatedFestivities
    })
  }

  return (
    <>
      <div className="border px-4 pt-4 rounded-xl w-full mb-3 max-w-xl md:mr-2">
        <div className="flex flex-col gap-2 justify-center items-start">
          <div className="text-left">
            <div className="text-lg font-medium">
              {vendor.servicesOffering.serviceName}
            </div>
            <div className="text-base mb-1 text-gray-700 capitalize">
              by {vendor.vendorName}
            </div>
            <div className="text-sm text-gray-700 capitalize">
              {vendor.servicesOffering.serviceDescription}
            </div>
            <div className="bg-purpleShade w-fit px-3 bg-opacity-85 rounded-full text-[13px] py-1 mt-3 -mx-1">
              Starting from ${vendor.servicesOffering.price}
            </div>
          </div>
          <div className="ml-auto mt-4">
            <ButtonSecondary
              text="Make an Offer"
              onClick={handleInviteButtonClick as any}
              icon={<IoPersonAdd />}
              fontSize="text-[13px]"
            />
          </div>
        </div>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
        className="font-poppins"
      >
        <div className="p-5 lg:w-4/5 mx-auto my-2 ">
          {/* close button */}
          <div className="ml-auto w-fit">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 "
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xl text-gray-800 font-medium">
                {vendor.servicesOffering.serviceName} by {vendor.vendorName}
              </span>
              <br />
              <span className="text-sm text-gray-500">
                {vendor.servicesOffering.serviceDescription}
              </span>
            </div>
            <div className="flex">
              <Button
                text="Make a Offer"
                onClick={inviteVendor}
                icon={<IoPersonAdd />}
              />
              {/* <span className="text-xl text-indigo-700 font-medium">
                ${vendor.servicesOffering.price}
              </span> */}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {vendor.servicesOffering.items.map((item, index) => (
              <div key={item._id} className="border rounded-md p-4 flex-1">
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
          <List className="relative">
            {festivityList.map((festivity) => (
              <div key={festivity._id} className="mb-4">
                <ListItem
                  button
                  onClick={() => handleFestivityChange(festivity._id)}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedFestivities.some(
                      (selectedFestivity) =>
                        selectedFestivity.subEventId === festivity._id,
                    )}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={festivity.name} />
                </ListItem>
                {selectedFestivities.some(
                  (selectedFestivity) =>
                    selectedFestivity.subEventId === festivity._id,
                ) && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-6">
                    {vendor.servicesOffering.items.map((item) => (
                      <ListItem
                        key={item._id}
                        dense
                        className="flex-initial"
                        button
                        onClick={() =>
                          handleItemChange(festivity._id, item._id)
                        }
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedFestivities.some(
                            (selectedFestivity) =>
                              selectedFestivity.subEventId === festivity._id &&
                              selectedFestivity.itemIds.includes(item._id),
                          )}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={item.name} />
                      </ListItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </List>
          <div className="py-3 px-2 text-xl font-medium text-indigo-700">
            Total Price: $
            {calculateTotalPrice(
              selectedFestivities,
              vendor.servicesOffering.price,
            )}
          </div>
        </div>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
