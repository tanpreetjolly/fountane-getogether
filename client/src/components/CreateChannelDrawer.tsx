import React, { useState } from "react"
import TextField from "@mui/material/TextField"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Checkbox from "@mui/material/Checkbox"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import { IoIosCloseCircle } from "react-icons/io"
// Sample user data
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "vendor",
    vendorType: "Food",
  },
  { name: "Jane Smith", email: "jane@example.com", role: "guest" },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "vendor",
    vendorType: "Entertainment",
  },
  { name: "Alice Williams", email: "alice@example.com", role: "guest" },
  {
    name: "Tom Davis",
    email: "tom@example.com",
    role: "vendor",
    vendorType: "Decor",
  },
]

type Props = {
  toggleDrawer: (arg: boolean) => (arg2: any) => void
}

const CreateChannelDrawer = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filterRole, setFilterRole] = useState<"all" | "vendor" | "guest">(
    "all",
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleUserSelect = (email: string) => {
    if (selectedUsers.includes(email)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== email))
    } else {
      setSelectedUsers([...selectedUsers, email])
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (filterRole === "all" ||
        (filterRole === "vendor" && user.role === "vendor") ||
        (filterRole === "guest" && user.role === "guest")) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-[90vh] px-3 py-2 ">
      <button
        onClick={props.toggleDrawer(false)}
        className="flex w-full justify-end "
      >
        <IoIosCloseCircle className="text-3xl text-red-600" />
      </button>
      <TextField
        label="Search Vendors, Guests"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        className="!mb-3 !mt-2"
      />
      <div className="mb-3 flex justify-center w-full gap-2 px-2">
        <button
          onClick={() => setFilterRole("all")}
          className={`mr-2 w-1/3 ${filterRole === "all" ? "rounded-lg py-1.5 bg-highlight text-white" : "outlined"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilterRole("vendor")}
          className={`mr-2 w-1/3 ${filterRole === "vendor" ? "rounded-lg py-1.5 bg-highlight text-white" : "outlined"}`}
        >
          Vendors
        </button>
        <button
          onClick={() => setFilterRole("guest")}
          className={`mr-2 w-1/3 ${filterRole === "guest" ? "rounded-lg py-1.5 bg-highlight text-white" : "outlined"}`}
        >
          Guests
        </button>
      </div>
      <List className="h-[65vh] overflow-y-auto">
        {filteredUsers.map((user) => (
          <ListItem
            key={user.email}
            secondaryAction={
              <Checkbox
                edge="end"
                checked={selectedUsers.includes(user.email)}
                onChange={() => handleUserSelect(user.email)}
              />
            }
          >
            <ListItemAvatar>
              <Avatar>{user.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <div>
                  <span>{user.email}</span>
                  {user.role === "vendor" && (
                    <span className="capitalize">
                      {" "}
                      - {user.role} ({user.vendorType})
                    </span>
                  )}
                  {user.role === "guest" && (
                    <span className="capitalize"> - {user.role}</span>
                  )}
                </div>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button text="Create Channel" onClick={() => {}} icon={<FaPlus />} />
    </div>
  )
}

export default CreateChannelDrawer
