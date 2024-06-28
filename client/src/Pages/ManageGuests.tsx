import { useEffect, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { Avatar, ListItemText } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import CardContent from "@mui/material/CardContent"
import Button from "../components/Button"
import { FaPlusCircle } from "react-icons/fa"
import ButtonSecondary from "@/components/ButtonSecondary"
import { RsvpRounded } from "@mui/icons-material"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { inviteGuest, inviteNewGuest, search } from "@/api"
import { OtherUserType, SubEventType } from "@/definitions"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Cross1Icon } from "@radix-ui/react-icons"

function capitalizeFirstLetter(string: string) {
  if (string.length === 0) {
    return string
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const ManageGuests = () => {
  const [selectedGuest, setSelectedGuest] = useState<OtherUserType | null>(null)
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<OtherUserType[] | null>(null)
  const [newGuest, setNewGuest] = useState<Partial<OtherUserType>>({
    name: "",
    email: "",
    phoneNo: "",
  })
  const [selectedSubEvents, setSelectedSubEvents] = useState<string[]>([])

  const { event, loadingEvent, updateEvent } = useEventContext()
  console.log(event)
  const closeDrawer = () => {
    setSelectedGuest(null)
    setIsInviteDrawerOpen(false)
    setNewGuest({ name: "", email: "", phoneNo: "" })
    setSelectedSubEvents([])
  }

  const handleNewGuestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewGuest((prevGuest) => ({ ...prevGuest, [name]: value }))
  }

  const handleSubEventChange = (subEventId: string) => {
    setSelectedSubEvents((prevSelectedSubEvents) =>
      prevSelectedSubEvents.includes(subEventId)
        ? prevSelectedSubEvents.filter((id) => id !== subEventId)
        : [...prevSelectedSubEvents, subEventId],
    )
  }

  const handleInviteNewGuest = () => {
    if (!newGuest.name || !newGuest.email || !newGuest.phoneNo) {
      return toast.error("Please fill in all the fields.")
    }
    if (event === null) return

    toast.promise(
      inviteNewGuest(event._id, {
        name: newGuest.name,
        email: newGuest.email,
        phoneNo: newGuest.phoneNo,
        subEventsIds: selectedSubEvents,
      }).finally(closeDrawer),
      {
        loading: "Sending Invite...",
        success: () => {
          updateEvent()
          return "Invite sent successfully"
        },
        error: (error) => {
          console.log(error)
          toast.remove(error.response.data?.msg)
          return error.response.data?.msg
        },
      },
      {
        id: "invite-new-guest",
        style: {
          minWidth: "250px",
        },
      },
    )
  }

  const guestList = event?.userList || []

  if (loadingEvent) return <Loader />
  if (!event) return <div>No event found</div>

  const subEvents = event.subEvents

  const filteredGuests =
    searchResult !== null ? searchResult : guestList.map((user) => user.user)
  const totalGuests = guestList.reduce(
    (acc, user) => acc + user.expectedGuests || 1,
    0,
  )
  const acceptedGuests = guestList.filter(
    (guest) => guest.status === "accepted",
  ).length
  const pendingGuests = guestList.filter(
    (guest) => guest.status === "pending",
  ).length

  return (
    <div className="px-4 flex flex-col mt-1  gap-2 md:gap-4 lg:w-5/6 mx-auto">
      <div className="bg-white px-5 py-6 border shadow-sm rounded-2xl">
        <div className="text-lg md:text-2xl pl-1  text-gray-700">
          Manage Guests for <br className="hidden md:block" />{" "}
          <span className="font-medium md:text-xl">{event.name}</span>
        </div>
        <div className="flex  flex-wrap justify-between mt-4 items-centre">
          <div className="flex flex-wrap gap-2 ">
            <div className="bg-purpleShade text-slate-800 px-3 py-1.5 rounded-lg">
              Total Guests: {totalGuests}
            </div>
            <div className="bg-purpleShade text-slate-800 px-3 py-1.5 rounded-lg">
              Invitations: {guestList.length}
            </div>
            <div className="bg-green-200 text-green-800 px-3 py-1.5 rounded-lg">
              Accepted: {acceptedGuests}
            </div>
            <div className="bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg">
              Pending: {pendingGuests}
            </div>
          </div>
          <div className="w-fit mt-4 mx-auto sm:mx-0 md:mt-0">
            <Button
              text="Invite New Contact"
              onClick={() => setIsInviteDrawerOpen(true)}
              icon={<FaPlusCircle />}
            />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white bg-opacity-80 rounded-2xl  shadow-sm">
        <SearchField setSearchResult={setSearchResult} />
        <h2 className="pl-1 mt-4 mb-1 text-gray-700">
          {searchResult ? "Search Results" : "Guests You've Invited"}
        </h2>
        <div className="grid md:grid-cols-2 gap-3 lg:grid-cols-3">
          {filteredGuests.map((guest) => (
            <div
              key={guest._id}
              style={{ cursor: "pointer", marginBottom: "8px" }}
              className="border rounded-xl"
            >
              <CardContent className="!pb-1">
                <div className="flex items-center">
                  <Avatar src={guest.profileImage} className="mr-3">
                    {guest.name[0]}
                  </Avatar>
                  <div className="mr-auto">
                    <Typography variant="h6" component="div">
                      {guest.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {guest.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {guest.phoneNo}
                    </Typography>
                  </div>
                </div>
                <div className="ml-auto w-fit">
                  <ButtonSecondary
                    backgroundColor="bg-blueShade"
                    text={
                      capitalizeFirstLetter(
                        guestList.find((user) => user.user._id === guest._id)
                          ?.status || "Invite",
                      ) +
                      (guestList.find((user) => user.user._id === guest._id)
                        ?.status === "accepted"
                        ? ` (${guestList.find((user) => user.user._id === guest._id)?.expectedGuests})`
                        : "")
                    }
                    // className="capitalize"
                    onClick={() => setSelectedGuest(guest)}
                    icon={<RsvpRounded />}
                  />
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </div>
      {selectedGuest && (
        <SwipeableDrawer
          anchor="bottom"
          open={!!selectedGuest}
          onClose={closeDrawer}
          onOpen={() => setSelectedGuest(null)}
        >
          <ShowSelectedGuest
            selectedGuest={selectedGuest}
            subEvents={subEvents}
            closeDrawer={closeDrawer}
          />
        </SwipeableDrawer>
      )}

      <SwipeableDrawer
        anchor="bottom"
        open={isInviteDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsInviteDrawerOpen(true)}
      >
        <Box sx={{ p: 2 }} className="w-full lg:!w-3/5 mx-auto">
          <Typography variant="h6" gutterBottom>
            Invite a New Guest
          </Typography>
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={newGuest.name}
            onChange={handleNewGuestChange}
            className="mb-2"
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={newGuest.email}
            onChange={handleNewGuestChange}
            className="mb-2"
          />
          <Input
            type="tel"
            placeholder="Phone"
            name="phoneNo"
            value={newGuest.phoneNo}
            onChange={handleNewGuestChange}
            className="mb-2"
          />
          <Typography variant="h6" gutterBottom>
            Select Festivities
          </Typography>
          <List>
            {subEvents.map((festivity: SubEventType) => (
              <ListItem key={festivity._id}>
                <ListItemText primary={festivity.name} />
                <Checkbox
                  checked={selectedSubEvents.includes(festivity._id)}
                  onChange={() => handleSubEventChange(festivity._id)}
                />
              </ListItem>
            ))}
          </List>
          <div className="mx-auto w-1/2">
            <Button
              text="Send Invite"
              onClick={handleInviteNewGuest}
              icon={<FaPlusCircle />}
              wfull={true}
            />
          </div>
        </Box>
      </SwipeableDrawer>
    </div>
  )
}

const SearchField = ({
  setSearchResult,
}: {
  setSearchResult: React.Dispatch<React.SetStateAction<OtherUserType[] | null>>
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      search(searchQuery, "user", 1, 10)
        .then((response: { data: { users: [] } }) => {
          // console.log(response.data.users)
          setSearchResult(response.data.users)
        })
        .catch((error) => console.error(error.response))
    }

    if (searchQuery.length >= 3) {
      if (timeoutId) clearTimeout(timeoutId)
      const id = setTimeout(fetchData, 500)
      setTimeoutId(id)
    } else {
      setSearchResult(null)
    }
  }, [searchQuery])

  return (
    <div className="md:w-1/3">
      <Input
        placeholder="Write more than 3 characters to search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="!mb-2 text-[13px] rounded-xl "
      />
    </div>
  )
}

const ShowSelectedGuest = ({
  selectedGuest,
  subEvents,
  closeDrawer,
}: {
  selectedGuest: OtherUserType
  subEvents: SubEventType[]
  closeDrawer: () => void
}) => {
  const [selectedSubEvents, setSelectedSubEvents] = useState<string[]>([])

  // console.log(selectedSubEvents)

  const handleSelectedSubEventChange = (festivity: SubEventType) => {
    setSelectedSubEvents((prevSelectedFestivities) =>
      prevSelectedFestivities.includes(festivity._id)
        ? prevSelectedFestivities.filter((id) => id !== festivity._id)
        : [...prevSelectedFestivities, festivity._id],
    )
  }

  const { updateEvent, event } = useEventContext()

  useEffect(() => {
    if (event === null) return

    const userId = selectedGuest._id
    const userSubEvents = event.userList.find(
      (user) => user.user._id === userId,
    )?.subEvents
    console.log(userSubEvents)

    setSelectedSubEvents(userSubEvents || [])
  }, [event, event?.userList, selectedGuest._id])

  if (!event) return null

  const handleInviteGuest = () => {
    // Here you would normally handle the submission logic, such as updating the guest list and sending the invite
    console.log("Inviting guest:", selectedGuest)
    toast.promise(
      inviteGuest(event._id, {
        guestId: selectedGuest._id,
        subEventsIds: selectedSubEvents,
      }),
      {
        loading: "Sending Invite...",
        success: () => {
          updateEvent()
          return "Invite sent successfully"
        },
        error: (error) => {
          console.log(error)
          return "Failed to send invite. Please try again later."
        },
      },
    )
    closeDrawer()
  }

  const isInvited = event.userList.find(
    (guest) => guest.user._id === selectedGuest._id,
  )

  return (
    <div className="w-full lg:w-4/5 mx-auto p-5">
      {/* close button */}
      <div className="flex justify-end">
        <ButtonSecondary
          text="Close"
          onClick={closeDrawer}
          backgroundColor="bg-gray-200"
          icon={<Cross1Icon />}
        />
      </div>
      <div className="flex  items-center  justify-between">
        <Typography variant="h6" gutterBottom>
          {selectedGuest.name + " "}
        </Typography>
        <div className="flex gap-2">
          {isInvited ? (
            isInvited.status === "accepted" ? (
              <>
                <span className="bg-green-200 px-2 py-0.5 rounded-lg">
                  Accepted🎉
                </span>
                <span className="bg-blueShade px-2 py-0.5 rounded-lg">
                  {" "}
                  Total Guests: {isInvited.expectedGuests}
                </span>
              </>
            ) : isInvited.status === "pending" ? (
              <span className="bg-yellow-200 px-2 py-0.5 rounded-lg">
                Pending
              </span>
            ) : (
              <span className="bg-red-200 px-2 py-0.5 rounded-lg">
                Rejected
              </span>
            )
          ) : (
            <span className="bg-gray-200 px-2 py-0.5 rounded-lg">
              Not Invited
            </span>
          )}
        </div>
      </div>
      <List>
        <ListItem>
          <ListItemText primary="Email" secondary={selectedGuest.email} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Phone" secondary={selectedGuest.phoneNo} />
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom>
        Invite to Festivities
      </Typography>
      <List>
        {subEvents.map((festivity) => (
          <ListItem key={festivity._id}>
            <ListItemText primary={festivity.name} />
            <Checkbox
              checked={selectedSubEvents.includes(festivity._id)}
              onChange={() => handleSelectedSubEventChange(festivity)}
            />
          </ListItem>
        ))}
      </List>
      <div className="ml-auto w-fit">
        <Button
          text={isInvited ? "Update" : "Invite"}
          onClick={handleInviteGuest}
          icon={<FaPlusCircle />}
        />
      </div>
    </div>
  )
}
export default ManageGuests
