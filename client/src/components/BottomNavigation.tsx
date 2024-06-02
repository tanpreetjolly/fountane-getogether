import React from "react"
import { Calendar, User, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BottomNav = () => {
  const [value, setValue] = React.useState<any>(0)
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 py-3 bg-white border-t border-gray-200 z-20">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList className="w-full flex justify-around bg-white">
          <TabsTrigger
            value="events"
            onClick={() => navigate("/events")}
            className="flex-1 flex justify-center items-center py-2"
          >
            <Calendar size={24} />
            <span className="hidden lg:inline mt-1 ml-2">My Events</span>
          </TabsTrigger>

          <TabsTrigger
            value="chats"
            onClick={() => navigate("/my-chats")}
            className="flex-1 flex justify-center items-center py-2"
          >
            <MessageCircle size={24} />
            <span className="hidden lg:inline mt-1 ml-2">Messages</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            onClick={() => navigate("/profile")}
            className="flex-1 flex justify-center items-center py-2"
          >
            <User size={24} />

            <span className="hidden lg:inline mt-1 ml-2">My Profile</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default BottomNav
