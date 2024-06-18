import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Button from "./Button"
import { IoClose, IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { VendorSaveType, ItemType } from "@/definitions"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"
import toast from "react-hot-toast"
import ButtonSecondary from "./ButtonSecondary"
import { makeAOffer } from "@/api"

type Props = {
  vendor: VendorSaveType
}

interface FestivityType {
  subEventId: string
  item: ItemType
  estimatedGuestNo: string
  offerPrice: string
}

const VendorCard = ({ vendor }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedFestivities, setSelectedFestivities] = useState<
    FestivityType[]
  >([])
  const { event, loadingEvent, updateEvent } = useEventContext()

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
    toast.promise(
      makeAOffer(event._id, {
        vendorProfileId: vendor.vendorProfileId,
        subEventIds: selectedFestivities.map((f) => f.subEventId),
        selectedItemIds: selectedFestivities.map((f) => f.item._id),
        serviceId: vendor.servicesOffering._id,
        estimatedGuestNos: selectedFestivities.map((f) => f.estimatedGuestNo),
        offerPrices: selectedFestivities.map((f) => f.offerPrice),
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

  const estimatedTotalPrice = selectedFestivities.reduce(
    (total, festivity) => total + parseInt(festivity.offerPrice),
    0,
  )

  const handleFestivityChange = (festivityId: string) => {
    setSelectedFestivities((prevFestivities) => {
      const existingFestivity = prevFestivities.find(
        (festivity) => festivity.subEventId === festivityId,
      )

      if (existingFestivity) {
        return prevFestivities.filter(
          (festivity) => festivity.subEventId !== festivityId,
        )
      }
      return [
        ...prevFestivities,
        {
          subEventId: festivityId,
          item: vendor.servicesOffering.items[0],
          offerPrice: vendor.servicesOffering.items[0].price.toString(),
          estimatedGuestNo: event.userList
            .reduce((acc, user) => {
              if (user.subEvents.some((subEvent) => subEvent === festivityId)) {
                return acc + 1
              }
              return acc
            }, 0)
            .toString(),
        },
      ]
    })
  }

  const handleInviteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawerOpen(true)
  }

  const handleItemChange = (festivityId: string, item: ItemType) => {
    setSelectedFestivities((p) => {
      return p.map((f) => {
        if (f.subEventId === festivityId) {
          f.item = item
          f.offerPrice = item.price.toString()
        }
        return f
      })
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
              Starting From $
              {Math.min(
                ...vendor.servicesOffering.items.map((item) => item.price),
              )}
            </div>
          </div>
          <img
            src={vendor.servicesOffering.serviceImage}
            alt="service"
            className="w-20 h-20 object-cover rounded-md"
          />
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
              <img
                src={vendor.servicesOffering.serviceImage}
                alt="service"
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
            <div className="flex">
              <Button
                text="Make a Offer"
                onClick={inviteVendor}
                icon={<IoPersonAdd />}
              />
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
                <p className="text-sm text-muted-foreground">${item.price}</p>
              </div>
            ))}
          </div>
          <List className="relative">
            {festivityList.map((festivity) => (
              <div key={festivity._id} className="mb-4">
                <ListItem onClick={() => handleFestivityChange(festivity._id)}>
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
                    <label htmlFor="estimatedGuestNo" className="text-sm">
                      Estimated Guest No
                    </label>
                    <input
                      id="estimatedGuestNo"
                      type="text"
                      value={
                        selectedFestivities.find((f) => {
                          return f.subEventId === festivity._id
                        })?.estimatedGuestNo
                      }
                      className="border p-2 rounded-md w-24"
                      placeholder="Estimated Guest No"
                      onChange={(e) => {
                        setSelectedFestivities((p) => {
                          return p.map((f) => {
                            if (f.subEventId === festivity._id) {
                              f.estimatedGuestNo = e.target.value
                            }
                            return f
                          })
                        })
                      }}
                    />
                    <label htmlFor="offerPrice" className="text-sm">
                      Offer Price ($)
                    </label>
                    <input
                      id="offerPrice"
                      type="text"
                      value={
                        selectedFestivities.find((f) => {
                          return f.subEventId === festivity._id
                        })?.offerPrice
                      }
                      className="border p-2 rounded-md w-24"
                      placeholder="Offer Price"
                      onChange={(e) => {
                        setSelectedFestivities((p) => {
                          return p.map((f) => {
                            if (f.subEventId === festivity._id) {
                              f.offerPrice = e.target.value
                            }
                            return f
                          })
                        })
                      }}
                    />
                    {vendor.servicesOffering.items.map((item) => (
                      <ListItem
                        key={item._id}
                        dense
                        className="flex-initial"
                        onClick={() => handleItemChange(festivity._id, item)}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedFestivities.some(
                            (selectedFestivity) =>
                              selectedFestivity.subEventId === festivity._id &&
                              selectedFestivity.item === item,
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
            Estimated Total Price: ${estimatedTotalPrice}
          </div>
        </div>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
