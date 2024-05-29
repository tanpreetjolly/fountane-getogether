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

const Navbar = () => {
  const navigate = useNavigate()
  const notifications = [
    { id: 1, sender: "John Doe", inviteId: "invite1" },
    { id: 2, sender: "Jane Smith", inviteId: "invite2" },
    { id: 3, sender: "Bob Johnson", inviteId: "invite3" },
  ]

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
                <span className="bg-orange-500 h-2.5 w-2.5 absolute top-2 right-2 rounded-full"></span>
              </button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <>
                <DropdownMenuItem key={notification.id}>
                  <div
                    onClick={() => navigate(`/invite/${notification.inviteId}`)}
                    role="button"
                    className="w-40 italic text-gray-600"
                  >
                    You have an invitation from{" "}
                    <span className="text-orange-500 font-medium">
                      {notification.sender}
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
