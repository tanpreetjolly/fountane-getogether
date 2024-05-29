import { ArrowLeft, Bell, MoveRightIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsType, InvitesType } from "@/definitions"
import { useAppDispatch, useAppSelector } from "@/hooks"

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

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const invites = user?.notifications || []

  const notifications = convertNotificationsToInvites(invites)
  console.log(notifications)

  return (
    <div>
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-gray-200">
        <DropdownMenu>
          <div className="flex justify-between items-center mx-auto px-1 pr-4 pt-3">
            <button
              className="p-2 rounded-full w-fit hover:bg-gray-200 focus:outline-none"
              onClick={() => {
                navigate(-1)
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <DropdownMenuTrigger className="w-fit">
              <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none relative ">
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="bg-orange-500 h-2.5 w-2.5 absolute top-2 right-2 rounded-full"></span>
                )}
              </button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 && (
              <DropdownMenuItem>
                <div className="w-40 italic text-gray-600">
                  No new notifications
                </div>
              </DropdownMenuItem>
            )}
            {notifications.map((notification) => (
              <>
                <DropdownMenuItem key={notification.id}>
                  <div
                    onClick={() => navigate(`/invites`)}
                    role="button"
                    className="w-48 italic text-gray-600"
                  >
                    You have an invitation from{" "}
                    <span className="text-orange-500 font-medium">
                      {notification.host} for {notification.eventName}
                    </span>{" "}
                    <span className="inline">
                      <MoveRightIcon size={12} className="inline" />
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}

export default Navbar
