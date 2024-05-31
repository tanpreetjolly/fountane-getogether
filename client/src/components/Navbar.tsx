import { ArrowLeft, MailPlus, MoveRightIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsType } from "@/definitions"
import { useAppSelector } from "@/hooks"

function convertNotificationsToInvitesForGuest(
  notifications: NotificationsType[],
) {
  return notifications.map((notification) => {
    return {
      ...notification,
      vendorList: undefined,
    }
  })
}

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []

  const guestInvites = convertNotificationsToInvitesForGuest(notifications)
  // const vendorInvites = convertNotificationsToInvitesForVendor(notifications)
  const vendorInvites = notifications.flatMap((notification) =>
    notification.vendorList.flatMap((vendorItem) =>
      vendorItem.subEvents.map((subEvent) => ({
        subEvent: subEvent,
        event: notification,
      })),
    ),
  )

  return (
    <nav className="bg-white border-b  pb-2 justify-between fixed w-screen z-20 top-0 start-0 border-gray-200">
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
              <MailPlus size={22} />
              {(guestInvites.length > 0 || vendorInvites.length > 0) && (
                <span className="bg-indigo-500 h-2.5 w-2.5 absolute top-2 right-2 rounded-full"></span>
              )}
            </button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {guestInvites.length === 0 && vendorInvites.length == 0 && (
            <DropdownMenuItem>
              <div className="w-40 italic text-gray-600">
                No new notifications
              </div>
            </DropdownMenuItem>
          )}
          {vendorInvites.map((notification) => (
            <>
              <DropdownMenuItem key={notification.subEvent._id}>
                <div
                  onClick={() => navigate(`/invites`)}
                  role="button"
                  className="w-64 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                >
                  <span className="text-blue-500 font-semibold">
                    {notification.event.host.name + " "}
                  </span>
                  has requested service
                  <span className="text-indigo-500 font-semibold">
                    {" " +
                      notification.subEvent.servicesOffering.serviceName +
                      " "}
                  </span>
                  for{" "}
                  <span className="text-indigo-500 font-semibold">
                    {notification.subEvent.subEvent.name}
                  </span>
                  <span className="text-indigo-500 font-semibold"></span>
                  <span className="inline">
                    <MoveRightIcon size={12} className="inline" />
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ))}
          {guestInvites.map((notification) => (
            <>
              <DropdownMenuItem key={notification._id}>
                <div
                  onClick={() => navigate(`/invites`)}
                  role="button"
                  className="w-64 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                >
                  <span className="text-blue-500 font-semibold">
                    {notification.host.name}
                  </span>{" "}
                  has invited you to
                  <span className="text-indigo-500 font-semibold">
                    {" " + notification.name}
                  </span>
                  <span className="inline-block ml-2">
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
  )
}

export default Navbar
