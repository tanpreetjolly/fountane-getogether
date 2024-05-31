import { ServiceListType } from "@/definitions"
import { Link } from "react-router-dom"
import { useEventContext } from "@/context/EventContext"
import Loader from "./Loader"

type Props = {
  service: ServiceListType
}

const VendorCard = ({ service }: Props) => {
  const { event, loadingEvent } = useEventContext()

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const getStatusColor = () => {
    switch (service.status) {
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
    <>
      <button className="border p-5 rounded-lg w-full">
        <Link
          to={`${service.vendorProfile._id}/chat`}
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
            className={`px-4 py-1.5 capitalize rounded-full ${getStatusColor()}`}
          >
            {service.status === "accepted"
              ? "Hired"
              : service.status || "Invite"}
          </div>
        </Link>
      </button>
    </>
  )
}

export default VendorCard
