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
import {  RsvpRounded } from "@mui/icons-material"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { inviteGuest, inviteNewGuest, search } from "@/api"
import { OtherUserType, SubEventType } from "@/definitions"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"

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

  const guestList = event?.userList || []

  if (loadingEvent) return <Loader />
  if (!event) return <div>No event found</div>

  const subEvents = event.subEvents


  const filteredGuests =
    searchResult !== null ? searchResult : guestList.map((user) => user.user)

  return (
    <div className="px-4 flex flex-col mt-1 pt-2 gap-2">
      <div className="text-xl pl-1 font-semibold text-gray-700">
        Manage Guests for <span className="text-indigo-600">{event.name}</span>
      </div>
      <Button
        text="Invite New Contact"
        onClick={() => setIsInviteDrawerOpen(true)}
        icon={<FaPlusCircle />}
      />
      <SearchField setSearchResult={setSearchResult} />
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
                text={capitalizeFirstLetter(
                  guestList.find((user) => user.user._id === guest._id)
                    ?.status || "Invite",
                )}
                // className="capitalize"
                onClick={() => setSelectedGuest(guest)}
                icon={<RsvpRounded />}
              />
            </div>
          </CardContent>
        </div>
      ))}
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
        <Box sx={{ p: 2 }}>
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
          <Button
            text="Send Invite"
            onClick={handleInviteNewGuest}
            icon={<FaPlusCircle />}
          />
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
    <>
      <Input
        placeholder="Search Contacts"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="!mb-2"
      />
    </>
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

  const isInvited = (guestId: string) => {
    return event.userList.some((guest) => guest.user._id === guestId)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {selectedGuest.name}
      </Typography>
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
      <Button
        text={isInvited(selectedGuest._id) ? "Update" : "Invite"}
        onClick={handleInviteGuest}
        icon={<FaPlusCircle />}
      />
    </Box>
  )
}
export default ManageGuests
