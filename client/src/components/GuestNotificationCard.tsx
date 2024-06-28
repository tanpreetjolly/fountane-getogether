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
import { useAppDispatch } from "@/hooks"
import { format } from "date-fns"
import { acceptRejectNotificationGuest } from "@/features/userSlice"
import { useState } from "react"

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMMM yyyy")
}
const formatDateShort = (date: string) => {
  return format(new Date(date), "dd MMM")
}
const GuestNotificationCard: React.FC<{ invite: NotificationsType }> = ({
  invite,
}) => {
  const [showModal, setShowModal] = useState<Boolean>(false)
  const [expectedGuest, setExpectedGuest] = useState<number>(1)
  const dispatch = useAppDispatch()

  const handleAcceptGuest = (
    eventId: string,
    userList: NotificationsType["userList"],
    status: string,
  ) => {
    dispatch(
      acceptRejectNotificationGuest(eventId, {
        status: status,
        userListId: userList._id,
        eventId: eventId,
        expectedGuest: expectedGuest,
      }),
    )
  }
  return (
    <div className=" pt-2">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 outline w-screen bg-gray-700 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-medium mb-4">
              Bring Your Friends Along!{" "}
            </h2>
            <div className="mb-4 flex flex-col">
              <label htmlFor="expectedGuest" className="block mb-4">
                We'd love to know how many guests you'll be bringing with you.
                <br />
                It's going to be a blast!
              </label>
              <input
                type="number"
                id="expectedGuest"
                value={expectedGuest}
                onChange={(e) => setExpectedGuest(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-1/4 mx-auto"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-indigo-500 text-white rounded-md px-4 py-2"
                onClick={() => {
                  handleAcceptGuest(invite._id, invite.userList, "accepted")
                  setShowModal(false)
                }}
              >
                Accept
              </button>
              <button
                className="ml-2 bg-gray-200 rounded-md px-4 py-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="p-4 relative">
          <CardTitle className="text-lg font-medium">{invite.name}</CardTitle>
          <CardDescription className="flex flex-col ml-2">
            <span className="flex Plans-center">
              <CalendarIcon className="text-indigo-500 mr-2" size={14} />
              {formatDate(invite.startDate)} - {formatDate(invite.endDate)}
            </span>

            <span className="flex items-center">
              <UserIcon className="text-indigo-500 mr-2" size={16} />
              <p>{invite.host.name}</p>
            </span>
            <div className="absolute right-5 top-2.5 text-sm font-medium capitalize border rounded-sm p-2">
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
              <span className="font-medium text-sm md:text-base text-zinc-900 capitalize flex justify-between">
                {subEvent.name}
                <span className="flex items-center text-xs mb-1">
                  <MapPinIcon className="mr-1" size={14} />
                  {subEvent.venue}
                </span>
              </span>
              <span className="flex items-center text-xs md:text-sm">
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
            onClick={() => setShowModal(true)}
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
    </div>
  )
}

export default GuestNotificationCard
