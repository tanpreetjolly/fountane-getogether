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
        return "bg-green-400 text-white "
      case "pending":
        return "bg-blue-400 text-white "
      case "rejected":
        return "bg-red-600 text-gray-300"
      default:
        return ""
    }
  }

  return (
    <div className="px-4 my-2 mb-8 flex flex-col h-[85vh] justify-between lg:w-4/5 mx-auto">
      <div>
        <div className="text-2xl pl-1 font-semibold text-zinc-800 mb-4">
          Vendors for {subEvent.name}
        </div>
        <Button
          text="Assign New Vendors"
          onClick={() => {
            navigate("search")
          }}
          icon={<FaPlusCircle />}
        />
        <Input
          type="search"
          placeholder="Search vendors..."
          className="my-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List>
          {filteredServiceList.length === 0 && (
            <div className="text-center italic text-xl px-4 text-gray-500 h-[40vh] flex flex-col gap-1 items-center justify-center">
              No vendors to show
              <br /> Assign your first vendor
              <NavLink
                to="search"
                className="p-2.5 border rounded-md border-blue-500 bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border-blue-500"
              >
                Search Vendors
              </NavLink>
            </div>
          )}
          {filteredServiceList.map((service) => (
            <ListItem key={service._id}>
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
                  <span>
                    Offered: ${service.amount}
                    {service.status === "accepted" && (
                      <>
                        <br />
                        PaymentStatus:{" "}
                        {service.paymentStatus[0].toUpperCase() +
                          service.paymentStatus.slice(1)}
                      </>
                    )}
                  </span>
                }
                secondaryTypographyProps={{ className: "pl-1" }}
              />
              <button
                className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor(service.status)}`}
                onClick={() => navigate(`${service.vendorProfile._id}`)}
              >
                {service.status === "accepted"
                  ? "Hired"
                  : service.status || "Invite"}
              </button>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  )
}

export default InviteGuests
