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
import { NotificationsType } from "@/definitions"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { format } from "date-fns"
import { acceptRejectNotification } from "@/features/userSlice"
import { Link } from "react-router-dom"

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}
const formatDateShort = (date: string) => {
  return format(new Date(date), "dd MMM")
}

const Invites = () => {
  // const [invites, setInvites] = useState(initialInvites)

  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []

  const guestInvites = notifications.filter(
    (notification) => notification.userList !== undefined,
  )

  const vendorInvites = notifications.flatMap((notification) =>
    notification.vendorList.flatMap((vendorItem) =>
      vendorItem.subEvents.map((subEvent) => ({
        subEvent: subEvent,
        event: notification,
      })),
    ),
  )

  const handleAcceptGuest = (
    eventId: string,
    userList: NotificationsType["userList"],
    status: string,
  ) => {
    dispatch(
      acceptRejectNotification(eventId, {
        status: status,
        userListId: userList._id,
      }),
    )
  }

  const handleAcceptVendor = (
    eventId: string,
    vendorListSubEventId: string,
    status: string,
  ) => {
    dispatch(
      acceptRejectNotification(eventId, {
        status: status,
        vendorListSubEventId: vendorListSubEventId,
      }),
    )
  }

  return (
    <>
      <div className="text-2xl px-5 my-2 font-semibold text-zinc-800">
        Your Invites
      </div>
      <div className=" px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guestInvites.length === 0 && vendorInvites.length === 0 && (
          <span>You don't have any invites yet</span>
        )}
        {guestInvites.map((invite) => (
          <Card key={invite._id} className="rounded-lg">
            <CardHeader className="p-4 relative">
              <CardTitle className="text-lg">{invite.name}</CardTitle>
              <CardDescription className="flex flex-col ml-2">
                <span className="flex items-center">
                  <CalendarIcon className="text-indigo-500 mr-2" size={14} />
                  {formatDate(invite.startDate)} - {formatDate(invite.endDate)}
                </span>

                <span className="flex items-center">
                  <UserIcon className="text-indigo-500 mr-2" size={16} />
                  <p>{invite.host.name}</p>
                </span>
                <div className="absolute right-5 top-2.5 text-sm font-semibold capitalize border rounded-sm p-2">
                  {invite.userList.status}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className=" p-4 pt-0 space-y-2 text-sm text-zinc-700">
              {invite.userList.subEvents.map((subEvent) => (
                <div
                  key={subEvent._id}
                  className="flex flex-col space-x-2 p-4 pb-3 border border-zinc-300 rounded-md"
                >
                  <span className="font-semibold text-base text-zinc-900 capitalize flex justify-between">
                    {subEvent.name}
                    <span className="flex items-center text-xs mb-1">
                      <MapPinIcon className="mr-1" size={14} />
                      {subEvent.venue}
                    </span>
                  </span>
                  <span className="flex items-center text-sm">
                    <CalendarIcon className="mr-2" size={16} />
                    {formatDateShort(subEvent.startDate)} -{" "}
                    {formatDateShort(subEvent.endDate)}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() =>
                  handleAcceptGuest(invite._id, invite.userList, "accepted")
                }
              >
                <CircleCheck className="inline mr-1" size={16} />
                Accept
              </Button>
              <Button
                className="bg-indigo-500"
                onClick={() =>
                  handleAcceptGuest(invite._id, invite.userList, "rejected")
                }
              >
                <CircleX className="inline mr-1" size={16} />
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))}
        {vendorInvites.map((invite) => (
          <Card key={invite.subEvent._id} className="rounded-lg">
            <CardHeader className="p-4 relative">
              <CardTitle>
                {invite.subEvent.subEvent.name + " - " + invite.event.name}
              </CardTitle>
              <CardDescription>
                {invite.subEvent.servicesOffering.serviceName}
              </CardDescription>
              <div className="absolute right-5 top-2.5 text-sm font-semibold capitalize border rounded-sm p-2">
                <Link
                  to={`/events/${invite.event._id}/festivity/${invite.subEvent.subEvent._id}`}
                >
                  Discuss
                </Link>
              </div>
            </CardHeader>
            <CardContent className=" p-4 pt-0">
              <div className="space-y-1 text-sm text-zinc-700">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 text-indigo-500" size={16} />
                  {formatDate(invite.subEvent.subEvent.startDate)} -{" "}
                  {formatDate(invite.subEvent.subEvent.endDate)}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 text-indigo-500" size={16} />
                  <span>{invite.subEvent.subEvent.venue}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 text-indigo-500" size={16} />
                  <span>{invite.event.host.name}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() =>
                  handleAcceptVendor(
                    invite.event._id,
                    invite.subEvent._id,
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
                    invite.event._id,
                    invite.subEvent._id,
                    "rejected",
                  )
                }
              >
                <CircleX className="inline mr-1" size={16} />
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default Invites
