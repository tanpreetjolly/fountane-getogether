import { NavLink, useSearchParams } from "react-router-dom"
import { getInvitationDetails, acceptRejectInviteGuestPublic } from "../api"
import { useEffect, useState } from "react"
import { OtherUserType, SubEventType } from "@/definitions"
import toast from "react-hot-toast"
import confirm from "../components/ConfirmationComponent"

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
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
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
        .then((data: { data: InvitationPageType }) =>
          setInviteDetails(data.data),
        )
        .catch((err) => console.log(err))
    }

    getInvitation()
  }, [token])

  const handleAcceptGuest = async (status: string) => {
    if (!token) return
    if (status === "rejected") {
      const confirmLogout = await confirm(
        "Are you sure you want to reject this invitation?",
        {
          title: "Reject Invitation",
          deleteButton: "Reject",
          cancelButton: "Cancel",
        },
      )
      if (confirmLogout === false) return
    }
    toast.promise(
      acceptRejectInviteGuestPublic(token, status, estimatedGuests),
      {
        loading: "Processing",
        success: () => {
          window.location.reload()
          return "Success"
        },
        error: (err) => {
          console.log(err)
          return err.response.data.msg
        },
      },
      {
        id: "acceptRejectNotification",
      },
    )
  }

  if (!token)
    return (
      <div className="text-red-500 text-center py-4">
        Invalid Invitation Link
      </div>
    )
  if (!inviteDetails) return <div className="text-center py-4">Loading...</div>

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-2">{inviteDetails.name}</h1>
      <p className="mb-1">Host: {inviteDetails.host.name}</p>
      <p className="mb-1">Start Date: {formatDate(inviteDetails.startDate)}</p>
      <p className="mb-4">End Date: {formatDate(inviteDetails.endDate)}</p>
      <h2 className="text-xl font-bold mb-2">User List</h2>
      <p className="mb-1">
        Status:{" "}
        {inviteDetails.userList.status[0].toUpperCase() +
          inviteDetails.userList.status.slice(1)}
      </p>
      <p className="mb-4">
        Expected Guests: {inviteDetails.userList.expectedGuests}
      </p>
      <h3 className="text-lg font-bold mb-2">Sub Events</h3>
      <ul className="list-disc pl-5">
        {inviteDetails.userList.subEvents.map((subEvent) => (
          <li key={subEvent._id} className="mb-4">
            <p className="font-bold">{subEvent.name}</p>
            <p>Start Date: {formatDate(subEvent.startDate)}</p>
            <p>End Date: {formatDate(subEvent.endDate)}</p>
            <p>Venue: {subEvent.venue}</p>
          </li>
        ))}
      </ul>
      {/* create one input box asking for number of estimated guest coming and two button accept and reject */}
      <div className="flex flex-col items-center">
        <label htmlFor="guest-count" className="mb-2">
          Number of estimated guests coming:
        </label>
        <input
          type="number"
          id="guest-count"
          value={estimatedGuests}
          onChange={(e) => setEstimatedGuests(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <div className="flex justify-between w-full">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              handleAcceptGuest("accepted")
            }}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleAcceptGuest("rejected")}
          >
            Reject
          </button>
        </div>
      </div>
      Or you can also create{" "}
      <NavLink to="/sign-in" className="text-blue-500">
        Sign In
      </NavLink>{" "}
      with the same email you received the invitation for more features and
      real-time updates.
    </div>
  )
}

export default InvitationPage
