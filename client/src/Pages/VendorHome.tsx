import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ButtonCustom from "../components/Button"
import { CiEdit } from "react-icons/ci"
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
import { Link, useNavigate } from "react-router-dom"

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}

const VendorHome: React.FC<{}> = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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

  return (
    <div className="px-4 pt-2">
      <ButtonCustom
        text="Change Service & Price"
        onClick={() => {
          navigate("edit-services")
        }}
        icon={<CiEdit className="text-2xl" />}
      />
      <div className="text-xl pl-1 mt-4 mb-2 font-semibold text-zinc-800">
        Service Requests
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceNotifications.map((notification) =>
          notification.serviceList.map((service) => (
            <Card key={service._id} className="rounded-lg">
              <CardHeader className="p-4 relative">
                <CardTitle>
                  {service.subEvent.name + " - " + notification.eventName}
                </CardTitle>
                <CardDescription>
                  Service Requested:
                  {service.servicesOffering.serviceName}
                </CardDescription>
                <div className="absolute right-5 top-2.5 text-sm font-semibold capitalize border rounded-sm p-2">
                  <Link to={`/my-chats/${service.vendorProfile}`}>Discuss</Link>
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() =>
                    handleAcceptVendor(
                      notification.eventId,
                      service._id,
                      "accepted",
                    )
                  }
                >
                  <CircleCheck className="inline mr-1" size={16} />
                  Accept
                </Button>
                <Button
                  className="bg-indigo-500"
                  onClick={() =>
                    handleAcceptVendor(
                      notification.eventId,
                      service._id,
                      "rejected",
                    )
                  }
                >
                  <CircleX className="inline mr-1" size={16} />
                  Reject
                </Button>
              </CardFooter>
            </Card>
          )),
        )}
      </div>
    </div>
  )
}

export default VendorHome
