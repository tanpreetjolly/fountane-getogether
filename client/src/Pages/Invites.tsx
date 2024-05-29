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

const initialInvites = [
  {
    id: "1",
    festivityName: "Diwali Celebration",
    eventName: "Diwali Party",
    timeSpan: "October 24, 2023 - October 25, 2023",
    venue: "Grand Ballroom, Hotel Marriott",
    host: "John Doe",
    status: "pending",
  },
  {
    id: "2",
    festivityName: "Christmas Eve",
    eventName: "Christmas Party",
    timeSpan: "December 24, 2023",
    venue: "Community Center",
    host: "Jane Smith",
    status: "pending",
  },
  {
    id: "3",
    festivityName: "New Year's Eve",
    eventName: "Countdown Party",
    timeSpan: "December 31, 2023 - January 1, 2024",
    venue: "City Park",
    host: "Bob Johnson",
    status: "pending",
  },
]

const Invites = () => {
  const [invites, setInvites] = useState(initialInvites)

  const handleAccept = (id: string) => {
    setInvites((prevInvites) =>
      prevInvites.map((invite) =>
        invite.id === id ? { ...invite, status: "accepted" } : invite,
      ),
    )
  }

  const handleReject = (id: string) => {
    setInvites((prevInvites) =>
      prevInvites.map((invite) =>
        invite.id === id ? { ...invite, status: "rejected" } : invite,
      ),
    )
  }

  return (
    <>
      <div className="text-2xl px-5 my-2 font-semibold text-zinc-800">
        Your Invites
      </div>
      <div className=" px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {invites.length === 0 && <span>You don't have any invites yet</span>}
        {invites.map((invite) => (
          <Card key={invite.id} className="rounded-lg">
            <CardHeader className="p-4">
              <CardTitle>{invite.festivityName}</CardTitle>
              <CardDescription>{invite.eventName}</CardDescription>
            </CardHeader>
            <CardContent className=" p-4 pt-0">
              <div className="space-y-1 text-sm text-zinc-700">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2" size={16} />
                  <span>{invite.timeSpan}</span>
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
              {invite.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleAccept(invite.id)}
                  >
                    <CircleCheck className="inline mr-1" size={16} />
                    Accept
                  </Button>
                  <Button
                    className="bg-indigo-500"
                    onClick={() => handleReject(invite.id)}
                  >
                    <CircleX className="inline mr-1" size={16} />
                    Reject
                  </Button>
                </>
              )}
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
