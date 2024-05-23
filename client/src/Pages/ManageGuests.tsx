import { useState } from "react"
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

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  status: "invite" | "invited"
}

const guestData: Guest[] = [
  {
    id: "11",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    status: "invite",
  },
  {
    id: "21",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9876543210",
    status: "invite",
  },
  {
    id: "31",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "5555555555",
    status: "invited",
  },
  {
    id: "41",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "1111111111",
    status: "invited",
  },
]

const festivities = ["Wedding", "Birthday", "Anniversary", "Corporate Event"]

const ManageGuests = () => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedFestivities, setSelectedFestivities] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false)
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({ name: "", email: "", phone: "" })

  const handleGuestClick = (guest: Guest) => {
    setSelectedGuest(guest)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleFestivityChange = (festivity: string) => {
    setSelectedFestivities((prevSelectedFestivities) =>
      prevSelectedFestivities.includes(festivity)
        ? prevSelectedFestivities.filter((item) => item !== festivity)
        : [...prevSelectedFestivities, festivity],
    )
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredGuests = guestData.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery),
  )

  const handleInviteButtonClick = () => {
    setIsInviteModalOpen(true)
  }

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false)
    setNewGuest({ name: "", email: "", phone: "" })
  }

  const handleNewGuestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewGuest((prevGuest) => ({ ...prevGuest, [name]: value }))
  }

  const handleInviteNewGuest = () => {
    // Here you would normally handle the submission logic, such as updating the guest list and sending the invite
    console.log("Inviting new guest:", newGuest)
    handleCloseInviteModal()
  }

  return (
    <div className="px-4">
      <Typography variant="h6" gutterBottom className="text-center">
        Manage Guests
      </Typography>
      <TextField
        fullWidth
        label="Search names"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        className="!mb-3"
      />
      {filteredGuests.length > 0 ? (
        filteredGuests.map((guest) => (
          <div
            key={guest.id}
            onClick={() => handleGuestClick(guest)}
            style={{ cursor: "pointer", marginBottom: "8px" }}
            className="border rounded-xl"
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {guest.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {guest.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {guest.phone}
              </Typography>
            </CardContent>
          </div>
        ))
      ) : (
        <div className="border p-2 py-4 rounded-lg text-gray-700 flex flex-col gap-3">
          <span className="px-3">
            Couldn't find your match, Click here to invite a new guest to app
          </span>
          <Button text="Invite a Guest" onClick={handleInviteButtonClick} icon={<FaPlusCircle />} />
        </div>
      )}
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box sx={{ p: 2 }}>
          {selectedGuest && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedGuest.name}
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={selectedGuest.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Phone"
                    secondary={selectedGuest.phone}
                  />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom>
                Invite to Festivities
              </Typography>
              <List>
                {festivities.map((festivity) => (
                  <ListItem key={festivity}>
                    <ListItemText primary={festivity} />
                    <Checkbox
                      checked={selectedFestivities.includes(festivity)}
                      onChange={() => handleFestivityChange(festivity)}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <Button text="Invite" onClick={closeDrawer} icon={<FaPlusCircle />} />
        </Box>
      </SwipeableDrawer>
      <Dialog open={isInviteModalOpen} onClose={handleCloseInviteModal} >
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
            value={newGuest.phone}
            onChange={handleNewGuestChange}
          />
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" onClick={handleCloseInviteModal} />
          <Button text="Send Invite" onClick={handleInviteNewGuest} icon={<FaPlusCircle />} />
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ManageGuests
