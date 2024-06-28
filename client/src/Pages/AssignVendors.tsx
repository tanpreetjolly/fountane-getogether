import { useState } from "react"
import List from "@mui/material/List"
import Loader from "@/components/Loader"
import Button from "@/components/Button"
import { FaPlusCircle } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { Avatar, ListItemAvatar } from "@mui/material"
import { useEventContext } from "@/context/EventContext"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import ButtonSecondary from "@/components/ButtonSecondary"
import { ArrowRight } from "lucide-react"

const InviteGuests = () => {
  const { event, loadingEvent } = useEventContext()
  const { subEventId } = useParams()
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate()

  const subEvent = event?.subEvents.find(
    (subEvent) => subEvent._id === subEventId,
  )

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  if (!subEventId) return <div>No SubEvent Found</div>
  if (!subEvent) return <div>No SubEvent Found</div>

  const filteredServiceList = event.serviceList.filter(
    (service) =>
      service.subEvent._id.toLowerCase() === subEventId.toLowerCase(),
  )
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-200 text-green-800 "
      case "pending":
        return "bg-blue-200 text-blue-800 "
      case "rejected":
        return "bg-red-200 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div className=" my-2 mb-8 flex flex-col h-[85vh] justify-between lg:w-4/5 mx-auto bg-white rounded-2xl p-5">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-xl md:text-2xl pl-1 font-medium text-zinc-800 ">
            Vendors for {subEvent.name}
          </div>
          {event.isHosted && (
            <div className="mt-3 sm:mt-0">
              <Button
                text="Assign New Vendors"
                onClick={() => {
                  navigate("search")
                }}
                icon={<FaPlusCircle />}
              />
            </div>
          )}
        </div>
        {event.isHosted && (
          <>
            <Input
              type="search"
              placeholder="Search vendors..."
              className="my-4 md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </>
        )}

        <List className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {filteredServiceList.length === 0 &&
            (event.isHosted ? (
              <div className="text-center italic  w-full md:text-xl px-4 text-gray-500 h-[40vh] flex flex-col gap-1 items-center justify-center">
                No vendors to show
                <br /> Assign your first vendor
                <NavLink
                  to="search"
                  className="py-1 px-4 border rounded-md border-blue-500 bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border-blue-500"
                >
                  Search Vendors
                </NavLink>
              </div>
            ) : (
              <div>Nothing to show</div>
            ))}
          {filteredServiceList.map((service) => (
            <ListItem
              key={service._id}
              className="border rounded-xl bg-white flex flex-col w-full"
            >
              <div className="flex items-center justify-between w-full">
                <ListItemAvatar>
                  <Avatar
                    src={service.vendorProfile.user.profileImage}
                    className="mr-3"
                  >
                    {service.servicesOffering.serviceName[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={service.servicesOffering.serviceName}
                  secondary={
                    event.isHosted && (
                      <span>
                        Offered: ${service.planSelected.price}
                        {service.status === "accepted" && (
                          <>
                            <br />
                            PaymentStatus:{" "}
                            {service.paymentStatus[0].toUpperCase() +
                              service.paymentStatus.slice(1)}
                          </>
                        )}
                      </span>
                    )
                  }
                  secondaryTypographyProps={{ className: "pl-1" }}
                />

                <div
                  className={`px-3 text-sm py-1 capitalize rounded-full ${getStatusColor(service.status)}`}
                >
                  {service.status === "accepted"
                    ? "Hired"
                    : service.status || "Invite"}
                </div>
              </div>

              <div className="w-fit mr-auto mt-auto pt-4">
                <ButtonSecondary
                  text="Discuss"
                  icon={<ArrowRight size={18} />}
                  onClick={() => {
                    navigate(`/my-chats/${service.vendorProfile.user._id}`)
                  }}
                />
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  )
}

export default InviteGuests
