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
  UserPlus,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { format } from "date-fns"
import {
  acceptRejectNotificationVendor,
  newOfferNotificationVendor,
} from "@/features/userSlice"
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
  isVendor: boolean
}> = ({ service, notification, isVendor }) => {
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
      acceptRejectNotificationVendor(eventId, {
        status: status,
        serviceListId: serviceListId,
        offerBy: isVendor ? "vendor" : "user",
      }),
    )
  }

  const handleAcceptVendorNewOffer = (
    eventId: string,
    serviceListId: string,
    newOfferPrice: number,
  ) => {
    dispatch(
      newOfferNotificationVendor(eventId, {
        serviceListId: serviceListId,
        newOfferPrice,
        offerBy: isVendor ? "vendor" : "user",
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
    <div className=" pt-2">
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

      <Card className="rounded-lg shadow-sm">
        <CardHeader className="p-4 relative">
          <CardTitle className="font-medium text-sate-800 w-4/5 ">
            {service.subEvent.name + " in " + notification.eventName}
          </CardTitle>
          <CardDescription className=" text-slate-900 w-4/5">
            Service Requested : {service.servicesOffering.serviceName}
          </CardDescription>
          <div className="absolute right-4 hidden md:block top-2.5 text-xs md:text-sm font-semibold capitalize border rounded-sm p-2">
            {!isVendor ? (
              <Link to={`/my-chats/${service.vendorProfile.user}`}>
                Discuss
              </Link>
            ) : (
              <Link to={`/my-chats/${notification.host._id}`}>Discuss</Link>
            )}
          </div>
        </CardHeader>
        <CardContent className=" p-4 pt-0">
          <div className="space-y-1 text-xs md:text-sm text-zinc-700 grid  gap-1">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 text-slate-500" size={16} />
              {formatDate(service.subEvent.startDate)} -{" "}
              {formatDate(service.subEvent.endDate)}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2 text-slate-500" size={16} />
              <span>{service.subEvent.venue}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="mr-2 text-slate-500" size={16} />
              <span>Hosted by {notification.host.name}</span>
            </div>
            <div className="flex items-center">
              <UserPlus className="mr-2 text-slate-500" size={16} />
              <span>Total Guest: {service.estimatedGuests}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center bg-green-200 rounded-lg text-slate-800 mt-3 w-fit px-3 py-0.5  ">
                <span>Offered Price: ${service.planSelected.price}</span>
              </div>
              <div className="flex items-center bg-purpleShade w-fit  px-3 mt-3 py-0.5 rounded-lg bg-opacity-80 text-slate-800">
                <span>Plan Selected: {service.planSelected.name}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded-lg `}>
                New Offer By:{" "}
                {service.offerBy[0].toUpperCase() + service.offerBy.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="md:flex justify-end p-4 pt-0 grid grid-cols-2 gap-2">
          <div className=" md:hidden flex text-sm font-medium text-center justify-center capitalize border rounded-sm py-2">
            {!isVendor ? (
              <Link to={`/my-chats/${service.vendorProfile.user}`}>
                Discuss
              </Link>
            ) : (
              <Link to={`/my-chats/${notification.host._id}`}>Discuss</Link>
            )}
          </div>
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
            Make New Offer
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
            className="bg-indigo-500 text-white"
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
