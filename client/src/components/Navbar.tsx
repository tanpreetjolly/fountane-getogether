import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  MessageSquareMore,
  MoveRightIcon,
  User,
} from "lucide-react"
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
import Loader from "./Loader"

function convertNotificationsToInvitesForGuest(
  notifications: NotificationsType[],
) {
  return notifications.map((notification) => {
    return {
      ...notification,
      serviceList: undefined,
    }
  })
}

const Navbar = () => {
  const navigate = useNavigate()
  const { user, loading } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []

  const guestNotifications = convertNotificationsToInvitesForGuest(
    notifications,
  ).filter((notification) => notification.userList !== undefined)
  const serviceNotifications = notifications
    .map((notification) => {
      return {
        serviceList: notification.serviceList,
        eventName: notification.name,
        host: notification.host,
      }
    })
    .flat()

  if (loading) return <Loader />
  if (!user) return <div>No User Found</div>

  return (
    <nav className="bg-white border-b  pb-2  justify-between fixed w-screen z-20 top-0 start-0 border-gray-200">
      <DropdownMenu>
        <div className="flex justify-between items-center  mx-auto px-1 pr-4 pt-3 md:w-5/6">
          <button
            className="p-2 rounded-full md:hidden  w-fit hover:bg-gray-200 focus:outline-none"
            onClick={() => {
              navigate(-1)
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <figure
            className="hidden md:block hover:cursor-pointer"
            onClick={() => navigate("/events") as any}
          >
            <img
              src="https://i.imgur.com/YA68OfS.png"
              alt="logo"
              className="h-10"
            />
          </figure>
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate("/events")
              }}
              className="p-2 mb-0.5   rounded-full hover:bg-gray-200 focus:outline-none relative "
            >
              <CalendarCheck size={22} />
            </button>
            <button
              onClick={() => {
                navigate("/my-chats")
              }}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none relative "
            >
              <MessageSquareMore size={22} />
            </button>
            <button
              onClick={() => {
                navigate("/profile")
              }}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none relative "
            >
              <User size={22} />
            </button>

            <DropdownMenuTrigger className="w-fit">
              <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none relative ">
                <Bell size={22} />
                {(guestNotifications.length > 0 ||
                  serviceNotifications.length > 0) && (
                  <span className="bg-indigo-500 h-2.5 w-2.5 absolute top-2 right-2 rounded-full"></span>
                )}
              </button>
            </DropdownMenuTrigger>
          </div>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {guestNotifications.length === 0 &&
            serviceNotifications.length == 0 && (
              <DropdownMenuItem>
                <div className="w-40 italic text-gray-600">
                  No new notifications
                </div>
              </DropdownMenuItem>
            )}
          {serviceNotifications.map((notification) =>
            notification.serviceList.map((service) => {
              if (notification.host._id === user?.userId) return null

              return (
                <>
                  <DropdownMenuItem key={service._id}>
                    <div
                      onClick={() => navigate(`/invites`)}
                      role="button"
                      className="w-64 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                    >
                      <span className="text-blue-500 font-semibold">
                        {notification.host.name + " "}
                      </span>
                      has requested service
                      <span className="text-indigo-500 font-semibold">
                        {" " + service.servicesOffering.serviceName + " "}
                      </span>
                      for{" "}
                      <span className="text-indigo-500 font-semibold">
                        {notification.eventName}
                      </span>
                      <span className="text-indigo-500 font-semibold"></span>
                      <span className="inline">
                        <MoveRightIcon size={12} className="inline" />
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )
            }),
          )}
          {guestNotifications.map((notification) => (
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
