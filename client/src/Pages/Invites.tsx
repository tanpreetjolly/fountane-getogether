import { useState } from "react"
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
import { InvitesType, NotificationsType } from "@/definitions"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { format } from "date-fns"
import { acceptRejectNotification } from "@/features/userSlice"

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}

function convertNotificationsToInvites(
  notifications: NotificationsType[],
): InvitesType[] {
  const invites: InvitesType[] = []

  notifications.forEach((notification) => {
    notification.userList.forEach((userItem) => {
      userItem.subEvents.forEach((subEvent) => {
        const invite: InvitesType = {
          id: userItem._id,
          eventId: notification._id,
          subEventName: subEvent.name,
          eventName: notification.name,
          startDate: notification.startDate,
          endDate: notification.endDate,
          venue: subEvent.venue,
          host: notification.host.name,
          status: userItem.status,
          userListId: userItem._id,
        }
        invites.push(invite)
      })
    })

    notification.vendorList.forEach((vendorItem) => {
      vendorItem.subEvents.forEach((subEvent) => {
        const invite: InvitesType = {
          id: vendorItem._id,
          eventId: notification._id,
          subEventName: subEvent.subEvent.name,
          eventName: notification.name,
          startDate: notification.startDate,
          endDate: notification.endDate,
          venue: subEvent.subEvent.venue,
          host: notification.host.name,
          status: subEvent.status,
          vendorListSubEventId: subEvent._id,
        }
        invites.push(invite)
      })
    })
  })

  return invites
}

const Invites = () => {
  // const [invites, setInvites] = useState(initialInvites)

  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []

  const invites = convertNotificationsToInvites(notifications)
  console.log(invites)

  const handleAccept = (invite: InvitesType, status: string) => {
    dispatch(
      acceptRejectNotification(invite.eventId, {
        status: status,
        userListId: invite.userListId,
        vendorListSubEventId: invite.vendorListSubEventId,
      }),
    )
  }

  return (
    <>
      <div className="text-2xl px-5 my-2 font-semibold text-zinc-800">
        Your Invites
      </div>
      <div className=" px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invites.length === 0 && <span>You don't have any invites yet</span>}
        {invites.map((invite) => (
          <Card key={invite.id} className="rounded-lg">
            <CardHeader className="p-4 relative">
              <CardTitle>{invite.subEventName}</CardTitle>
              <CardDescription>{invite.eventName}</CardDescription>
              <div className="absolute right-5 top-2.5 text-sm font-semibold capitalize border rounded-sm p-2">
                {invite.status}
              </div>
            </CardHeader>
            <CardContent className=" p-4 pt-0">
              <div className="space-y-1 text-sm text-zinc-700">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2" size={16} />
                  {formatDate(invite.startDate)} - {formatDate(invite.endDate)}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="mr-2" size={16} />
                  <span>{invite.venue}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2" size={16} />
                  <span>{invite.host}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => handleAccept(invite, "accepted")}
              >
                <CircleCheck className="inline mr-1" size={16} />
                Accept
              </Button>
              <Button
                className="bg-indigo-500"
                onClick={() => handleAccept(invite, "rejected")}
              >
                <CircleX className="inline mr-1" size={16} />
                Reject
              </Button>
              {invite.status === "accepted" && (
                <div className="text-green-500 font-semibold">Accepted</div>
              )}
              {invite.status === "rejected" && (
                <div className="text-red-500 font-semibold">Rejected</div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default Invites
