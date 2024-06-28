import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Button from "./Button"
import { IoClose, IoPersonAdd } from "react-icons/io5"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import { ServiceSearchType, ItemType } from "@/definitions"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"
import toast from "react-hot-toast"
import ButtonSecondary from "./ButtonSecondary"
import { makeAOffer } from "@/api"

type Props = {
  service: ServiceSearchType
}

interface FestivityType {
  subEventId: string
  item: ItemType
  estimatedGuestNo: string
  offerPrice: string
}

const VendorCard = ({ service }: Props) => {
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
        vendorProfileId: service.vendorProfileId._id,
        subEventIds: selectedFestivities.map((f) => f.subEventId),
        selectedItemIds: selectedFestivities.map((f) => f.item._id),
        serviceId: service._id,
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
          item: service.items[0],
          offerPrice: service.items[0].price.toString(),
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
          <div className="flex items-center justify-between w-full gap-2">
            <div className="text-left">
              <div className="text-lg font-medium">{service.serviceName}</div>
              <div className="text-base mb-1 text-gray-700 capitalize">
                by {service.vendorProfileId.user.name}
              </div>
              <div className="text-sm text-gray-700 capitalize">
                {service.serviceDescription}
              </div>
              <div className="bg-purpleShade w-fit px-3 bg-opacity-85 rounded-full text-[13px] py-1 mt-3 -mx-1">
                Starting From $
                {Math.min(...service.items.map((item) => item.price))}
              </div>
            </div>
            <img
              src={service.serviceImage}
              alt="service"
              className="w-20 h-20 object-cover rounded-md"
            />
          </div>
          <div className="ml-auto mt-auto">
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
            <div className="flex  flex-col max-w-xl w-1/2 gap-3 justify-between ">
              <div>
                <span className="text-xl text-gray-800 font-medium">
                  {service.serviceName} by {service.vendorProfileId.user.name}
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  {service.serviceDescription}
                </span>
              </div>
              <div className="flex  ">
                <Button
                  text="Make a Offer"
                  onClick={inviteVendor}
                  icon={<IoPersonAdd />}
                  fontSize="text-sm md:text-base"
                />
              </div>
            </div>
            <img
              src={service.serviceImage}
              alt="service"
              className="w-20 h-20 object-cover rounded-md"
            />
          </div>
          <div className="ml-auto w-fit bg-gray-100 rounded-xl px-4 py-1 md:text-lg  text-slate-900 ">
            Total Offer Amount:{" "}
            <span className="font-medium">${estimatedTotalPrice}</span>
          </div>
          <p className="p-0.5 mt-3 md:mt-0 text-sm text-slate-800">
            Plans we offer:
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            {service.items.map((item, index) => (
              <div key={item._id} className="border rounded-md p-3 flex-1">
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <h4 className=" text-sm md:text-base font-medium">
                    {index + 1 + ". " + item.name}
                  </h4>
                  <p className="text-xs md:text-sm bg-green-200  text-green-900 px-2 rounded-xl py-0.5">
                    ${item.price}
                  </p>
                </div>
                <p className="text-[13px] md:text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <p className="pt-2 mt-3 p-0.5 text-slate-800 text-sm ">
            Select a festivity and the required plan for it
          </p>
          <List className="relative ">
            {festivityList.map((festivity) => (
              <div key={festivity._id} className="mb-2 border rounded-2xl">
                <ListItem onClick={() => handleFestivityChange(festivity._id)}>
                  <Checkbox
                    edge="start"
                    size="small"
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
                  <div className="border pt-2 mb-2 mx-4 bg-slate-50 rounded-xl">
                    <div className="flex flex-col sm:flex-row  md:items-center justify-start ml-3   gap-1.5 md:gap-4">
                      <div className="flex gap-2 items-center bg-blueShade px-3 py-0.5 rounded-lg">
                        <label
                          htmlFor="estimatedGuestNo"
                          className="text-xs  md:text-sm"
                        >
                          Estimated Total Guests:
                        </label>
                        <input
                          id="estimatedGuestNo"
                          type="text"
                          value={
                            selectedFestivities.find((f) => {
                              return f.subEventId === festivity._id
                            })?.estimatedGuestNo
                          }
                          className="border  rounded text-xs  md:text-sm w-10 text-center"
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
                      </div>
                      <div className="flex items-center gap-2 bg-yellowShade rounded-lg px-3 py-0.5">
                        <label
                          htmlFor="offerPrice"
                          className="text-xs  md:text-sm"
                        >
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
                          className="border py-0.5 rounded-md w-16 text-center text-xs  md:text-sm"
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
                      </div>
                    </div>
                    {service.items.map((item) => (
                      <ListItem
                        key={item._id}
                        dense
                        className="flex-initial"
                        onClick={() => handleItemChange(festivity._id, item)}
                      >
                        <Checkbox
                          size="small"
                          edge="start"
                          color="secondary"
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
        </div>
      </SwipeableDrawer>
    </>
  )
}

export default VendorCard
