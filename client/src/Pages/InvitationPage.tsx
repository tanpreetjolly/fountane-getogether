import { NavLink, useSearchParams } from "react-router-dom"
import { getInvitationDetails, acceptRejectInviteGuestPublic } from "../api"
import { useEffect, useState } from "react"
import { OtherUserType, SubEventType } from "@/definitions"
import toast from "react-hot-toast"
import confirm from "../components/ConfirmationComponent"
import ButtonSecondary from "../components/ButtonSecondary"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, User } from "lucide-react"
import { IoClose } from "react-icons/io5"

interface InvitationPageType {
  _id: string
  name: string
  host: OtherUserType
  startDate: string
  endDate: string
  userList: {
    _id: string
    user: OtherUserType
    subEvents: [SubEventType]
    expectedGuests: number
    createdAt: string
    status: string
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const InvitationPage = () => {
  const [estimatedGuests, setEstimatedGuests] = useState(1)
  const [inviteDetails, setInviteDetails] = useState<InvitationPageType | null>(
    null,
  )
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) return
    const getInvitation = async () => {
      getInvitationDetails(token)
        .then((data: { data: InvitationPageType }) => {
          setInviteDetails(data.data)
          setEstimatedGuests(data.data.userList.expectedGuests)
        })
        .catch((err) => console.log(err))
    }

    getInvitation()
  }, [token])

  const handleAcceptGuest = async (status: string) => {
    if (!token) return
    if (status === "rejected") {
      const confirmLogout = await confirm(
        "Are you sure you want to decline this invitation?",
        {
          title: "Decline Invitation",
          deleteButton: "Decline",
          cancelButton: "Cancel",
        },
      )
      if (confirmLogout === false) return
    }
    toast.promise(
      acceptRejectInviteGuestPublic(token, status, estimatedGuests),
      {
        loading: "Processing your response...",
        success: () => {
          window.location.reload()
          return status === "accepted"
            ? "You're all set! We look forward to seeing you."
            : "Thank you for letting us know. We'll miss you!"
        },
        error: (err) => {
          console.log(err)
          return "Oops! Something went wrong. Please try again."
        },
      },
      {
        id: "acceptRejectNotification",
      },
    )
  }

  if (!token)
    return (
      <div className="text-red-500 text-center py-4 font-medium">
        Oops! It seems this invitation link is invalid or has expired.
      </div>
    )
  if (!inviteDetails)
    return <div className="text-center py-4">Loading your invitation...</div>

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10 font-sans">
      <h1 className="text-4xl font-medium mb-6 text-gray-800 border-b pb-4">
        {inviteDetails.name}
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        You've been cordially invited to join us for this special event!
      </p>

      <div className="space-y-2 mb-3 flex items-center justify-between  ">
        <div className="flex items-center space-x-2 text-slate-800 bg-yellowShade px-2 bg-opacity-80 rounded-lg py-0.5">
          <User size={16} />
          <span className="font-medium">Host:&nbsp;</span>
          {inviteDetails.host.name}
        </div>
        <div className="flex items-center space-x-2 text-slate-800  bg-yellowShade px-2 bg-opacity-80 rounded-lg py-0.5">
          <Calendar size={16} />
          <span className="font-medium">Date:</span>&nbsp;
          {formatDate(inviteDetails.startDate)} -{" "}
          {formatDate(inviteDetails.endDate)}
        </div>
      </div>

      <h2 className="text-2xl font-medium mb-4 text-gray-700">Festivities</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {inviteDetails.userList.subEvents.map((subEvent) => (
          <div key={subEvent._id} className="bg-blue-100 p-4 rounded-md ">
            <p className="font-medium mb-1">{subEvent.name}</p>
            <p className="text-sm mb-1 text-gray-800 flex items-center">
              <Calendar size={16} className="mr-2" />{" "}
              {formatDate(subEvent.startDate)} -{formatDate(subEvent.endDate)}
            </p>
            <p className="text-sm text-gray-800 flex items-center">
              <MapPin size={16} className="mr-2" /> {subEvent.venue}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-8">
        <label
          htmlFor="guest-count"
          className="block mb-2 font-medium text-gray-700"
        >
          How many guests will be joining you?
        </label>
        <Input
          type="number"
          id="guest-count"
          value={estimatedGuests}
          onChange={(e) => setEstimatedGuests(Number(e.target.value))}
          className="mb-4"
          min="1"
        />
        <div className="flex justify-between gap-2 w-1/2 ml-auto">
          <ButtonSecondary
            text="Accept "
            icon={<span className="text-xl">🎉</span>}
            onClick={() => handleAcceptGuest("accepted")}
            backgroundColor="bg-purpleShade"
            fullWidth
          />
          <ButtonSecondary
            text="Decline "
            onClick={() => handleAcceptGuest("rejected")}
            icon={<IoClose />}
            backgroundColor="bg-red-400"
            fullWidth
          />
        </div>
      </div>

      <p className="text-center text-gray-600">
        Want more features and real-time updates?{" "}
        <NavLink to="/sign-in" className="text-blue-500 hover:underline">
          Sign in
        </NavLink>{" "}
        with the email address this invitation was sent to.
      </p>
    </div>
  )
}

export default InvitationPage
