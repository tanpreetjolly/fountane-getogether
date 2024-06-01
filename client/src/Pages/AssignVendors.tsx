import { useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Button from "@/components/Button"
import { FaPlusCircle } from "react-icons/fa"
import Loader from "@/components/Loader"
import { useEventContext } from "@/context/EventContext"
import { useNavigate, useParams } from "react-router-dom"
import { Avatar, ListItemAvatar } from "@mui/material"
import { Input } from "@/components/ui/input"

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
    <div className="px-4 my-2 mb-8 flex flex-col h-[85vh] justify-between">
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
