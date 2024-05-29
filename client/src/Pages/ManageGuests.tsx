import { useEffect, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { ListItemText } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import CardContent from "@mui/material/CardContent"
import Button from "../components/Button"
import { FaPlusCircle } from "react-icons/fa"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import ButtonSecondary from "@/components/ButtonSecondary"
import { RsvpOutlined } from "@mui/icons-material"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { inviteGuest, inviteNewGuest, search } from "@/api"
import { OtherUserType, SubEventType } from "@/definitions"
import toast from "react-hot-toast"

const ManageGuests = () => {
  const [selectedGuest, setSelectedGuest] = useState<OtherUserType | null>(null)
  // const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  // const [searchQuery, setSearchQuery] = useState<string>("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<OtherUserType[] | null>(null)
  const [newGuest, setNewGuest] = useState<Partial<OtherUserType>>({
    name: "",
    email: "",
    phoneNo: "",
  })

  const { event, loadingEvent, updateEvent } = useEventContext()

  const closeDrawer = () => {
    setSelectedGuest(null)
  }

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false)
    setNewGuest({ name: "", email: "", phoneNo: "" })
  }

  const handleNewGuestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewGuest((prevGuest) => ({ ...prevGuest, [name]: value }))
  }

  const handleInviteNewGuest = () => {
    // Here you would normally handle the submission logic, such as updating the guest list and sending the invite
    console.log("Inviting new guest:", newGuest)

    if (!newGuest.name || !newGuest.email || !newGuest.phoneNo) {
      return toast.error("Please fill in all the fields.")
    }
    if (event === null) return

    toast.error("SubEventsIds is yet to be added")

    toast.promise(
      inviteNewGuest(event._id, {
        name: newGuest.name,
        email: newGuest.email,
        phoneNo: newGuest.phoneNo,
        //please add this
        subEventsIds: [],
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

    handleCloseInviteModal()
  }

  const guestList = event?.userList || []

  if (loadingEvent) return <Loader />
  if (!event) return <div>No event found</div>

  const subEvents = event.subEvents

  const isInvited = (guestId: string) => {
    return guestList.some((guest) => guest.user._id === guestId)
  }

  const filteredGuests =
    searchResult !== null ? searchResult : guestList.map((user) => user.user)

  return (
    <div className="px-4 flex flex-col mt-1 gap-2">
      <div className="text-2xl font-semibold text-gray-700">Manage Guests</div>
      <SearchField setSearchResult={setSearchResult} />
      {filteredGuests.map((guest) => (
        <div
          key={guest._id}
          style={{ cursor: "pointer", marginBottom: "8px" }}
          className="border rounded-xl"
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
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
              <ButtonSecondary
                text={isInvited(guest._id) ? "Invited" : "Invite"}
                onClick={() => setSelectedGuest(guest)}
                icon={<RsvpOutlined />}
              />
            </div>
          </CardContent>
        </div>
      ))}
      <div className="border p-2 py-4 rounded-lg text-gray-700 flex flex-col gap-3">
        <span className="px-3">
          Match not found. Click here to invite a new guest.
        </span>
        <Button
          text="Invite a Guest"
          onClick={() => setIsInviteModalOpen(true)}
          icon={<FaPlusCircle />}
        />
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
      <Dialog open={isInviteModalOpen} onClose={handleCloseInviteModal}>
        <DialogTitle>
          Invite a New Guest
          <IconButton
            aria-label="close"
            onClick={handleCloseInviteModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={newGuest.name}
            onChange={handleNewGuestChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            value={newGuest.email}
            onChange={handleNewGuestChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            fullWidth
            variant="outlined"
            value={newGuest.phoneNo}
            onChange={handleNewGuestChange}
          />
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" onClick={handleCloseInviteModal} />
          <Button
            text="Send Invite"
            onClick={handleInviteNewGuest}
            icon={<FaPlusCircle />}
          />
        </DialogActions>
      </Dialog>
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
    <TextField
      fullWidth
      label="Name / Email / Phone Number"
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="!mb-2"
    />
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
