import { useState } from "react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Button from "@/components/Button"
import { FaPlusCircle } from "react-icons/fa"

type Props = {}

const guestData = [
  {
    id: "11",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  },
  {
    id: "21",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
  },
  {
    id: "31",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "5555555555",
  },
  {
    id: "41",
    name: "Samantha Lee",
    email: "samantha@example.com",
    phone: "1111111111",
  },
]

const InviteGuests = (_props: Props) => {
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])

  const handleGuestChange = (guestId: string) => {
    setSelectedGuests((prevSelectedGuests) =>
      prevSelectedGuests.includes(guestId)
        ? prevSelectedGuests.filter((id) => id !== guestId)
        : [...prevSelectedGuests, guestId],
    )
  }

  return (
    <div className="px-2 my-2 flex flex-col h-[85vh] justify-between">
      <div>
        <div className="text-2xl px-3 font-semibold text-zinc-800">
          Invite Guests for the Festivity
        </div>
        <List>
          {guestData.map((guest) => (
            <ListItem
              key={guest.id}
              secondaryAction={
                <Checkbox
                  color="secondary"
                  edge="end"
                  checked={selectedGuests.includes(guest.id)}
                  onChange={() => handleGuestChange(guest.id)}
                />
              }
              className="flex flex-col !text-left !items-start"
            >
              <ListItemText primary={guest.name} />
              <ListItemText secondary={`Email: ${guest.email}`} />
              <ListItemText secondary={`Phone: ${guest.phone}`} />
            </ListItem>
          ))}
        </List>
      </div>
      <Button
        text="Save Selected Guests"
        onClick={() => {}}
        icon={<FaPlusCircle />}
      />
    </div>
  )
}

export default InviteGuests
