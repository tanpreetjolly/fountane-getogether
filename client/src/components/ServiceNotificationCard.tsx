import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  CircleCheck,
  CircleX,
  MapPinIcon,
  UserIcon,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { format } from "date-fns"
import { acceptRejectNotification } from "@/features/userSlice"
import { Link } from "react-router-dom"
import { useState } from "react"
import { ServiceTypeNotifications, OtherUserType } from "@/definitions"

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}

const ServiceNotificationCard: React.FC<{
  service: ServiceTypeNotifications
  notification: {
    serviceList: ServiceTypeNotifications[]
    eventId: string
    eventName: string
    host: OtherUserType
  }
}> = ({ service, notification }) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState<{
    eventId: string
    serviceListId: string
  } | null>(null)
  const [offerPrice, setOfferPrice] = useState("")

  const { user } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []

  const serviceNotifications = notifications
    .map((notification) => {
      return {
        serviceList: notification.serviceList,
        eventId: notification._id,
        eventName: notification.name,
        host: notification.host,
      }
    })
    .flat()

  const handleAcceptVendor = (
    eventId: string,
    serviceListId: string,
    status: string,
  ) => {
    dispatch(
      acceptRejectNotification(eventId, {
        status: status,
        serviceListId: serviceListId,
      }),
    )
  }

  const handleAcceptVendorNewOffer = (
    eventId: string,
    serviceListId: string,
    status: string,
    newOfferPrice: number,
  ) => {
    dispatch(
      acceptRejectNotification(eventId, {
        status: status,
        serviceListId: serviceListId,
        newOfferPrice,
        offerBy: user?.userId === notification.host._id ? "vendor" : "user",
      }),
    )
  }

  let count = 0
  serviceNotifications.map((notification) =>
    notification.serviceList.map((_service) => count++),
  )
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfferPrice(e.target.value)
  }
  return (
    <div className="px-4 pt-2">
      {showModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 outline w-screen bg-gray-700 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Make a New Offer</h2>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2">
                Price
              </label>
              <input
                type="text"
                id="price"
                value={offerPrice}
                onChange={handlePriceChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-indigo-500 text-white rounded-md px-4 py-2"
                onClick={() => {
                  handleAcceptVendorNewOffer(
                    showModal.eventId,
                    showModal.serviceListId,
                    "pending",
                    parseInt(offerPrice, 10),
                  )
                  setShowModal(null)
                }}
              >
                Submit
              </button>
              <button
                className="ml-2 bg-gray-200 rounded-md px-4 py-2"
                onClick={() => setShowModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="rounded-lg">
        <CardHeader className="p-4 relative">
          <CardTitle>
            {service.subEvent.name + " - " + notification.eventName}
          </CardTitle>
          <CardDescription>
            Service Requested:
            {service.servicesOffering.serviceName}
          </CardDescription>
          <div className="absolute right-5 top-2.5 text-sm font-semibold capitalize border rounded-sm p-2">
            <Link to={`/my-chats/${service.vendorProfile.user}`}>Discuss</Link>
          </div>
        </CardHeader>
        <CardContent className=" p-4 pt-0">
          <div className="space-y-1 text-sm text-zinc-700">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 text-indigo-500" size={16} />
              {formatDate(service.subEvent.startDate)} -{" "}
              {formatDate(service.subEvent.endDate)}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2 text-indigo-500" size={16} />
              <span>{service.subEvent.venue}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="mr-2 text-indigo-500" size={16} />
              <span>{notification.host.name}</span>
            </div>
            <div className="flex items-center">
              <span>Estimated Guest: {service.estimatedGuests}</span>
            </div>
            <div className="flex items-center">
              <span>Offered Price: ${service.planSelected.price}</span>
            </div>
            <div className="flex items-center">
              <span>
                Plan Selected:
                {service.planSelected.name}
              </span>
            </div>
            <div className="flex items-center">
              <span>
                New Offer By:
                {service.offerBy[0].toUpperCase() + service.offerBy.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-0">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() =>
              setShowModal({
                eventId: notification.eventId,
                serviceListId: service._id,
              })
            }
          >
            Make a New Offer
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() =>
              handleAcceptVendor(notification.eventId, service._id, "accepted")
            }
          >
            <CircleCheck className="inline mr-1" size={16} />
            Accept
          </Button>
          <Button
            className="bg-indigo-500"
            onClick={() =>
              handleAcceptVendor(notification.eventId, service._id, "rejected")
            }
          >
            <CircleX className="inline mr-1" size={16} />
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ServiceNotificationCard
