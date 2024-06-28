import { useEffect, useMemo, useState } from "react"
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
import { indigo } from "@mui/material/colors" // Import the indigo color
import { useEventContext } from "@/context/EventContext"
import { Loader } from "lucide-react"
import { createSubEventChannel } from "@/api"
import toast from "react-hot-toast"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { OtherUserType, ServiceListType, UserListType } from "@/definitions"

const getUsers = (userList: UserListType[], serviceList: ServiceListType[]) => {
  const vendorMap = new Map<string, OtherUserType>()
  serviceList
    .map((vendor) => vendor.vendorProfile.user)
    .forEach((user) => vendorMap.set(user._id, user))
  const vendorUser = Array.from(vendorMap.values())
  const guestUsers = userList.map((user) => user.user)

  const combineList = new Map<string, OtherUserType>()
  vendorUser.forEach((user) => combineList.set(user._id, user))
  guestUsers.forEach((user) => combineList.set(user._id, user))
  return [vendorUser, guestUsers, Array.from(combineList.values())]
}

type Props = {
  toggleDrawer: (arg: boolean) => (arg2: any) => void
}

const CreateChannelDrawer = ({ toggleDrawer }: Props) => {
  const [channelName, setChannelName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filterRole, setFilterRole] = useState<"all" | "vendor" | "guest">(
    "all",
  )

  const navigate = useNavigate()
  const { eventId, subEventId } = useParams()
  const { event, loadingEvent, updateEvent } = useEventContext()

  const [vendorUser, guestUsers, combineList] = useMemo(
    getUsers.bind(null, event?.userList || [], event?.serviceList || []),
    [event],
  )

  useEffect(() => {
    if (!event) return
    setSelectedUsers([event.host._id])
  }, [])

  if (!eventId) return <Navigate to="/events" />
  if (!subEventId) return <Navigate to={`/events/${eventId}`} />
  if (loadingEvent) return <Loader />
  if (!event) return <div>Event Not Found</div>

  const handleUserSelect = (userId: string) => {
    //if user is host then return
    if (event.host._id === userId) {
      return
    }
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleCreateChannel = () => {
    console.log("Create Channel")
    if (channelName === "") {
      return toast.error("Channel Name is required", { id: "channelName" })
    }
    toast.promise(
      createSubEventChannel(eventId, subEventId, {
        name: channelName,
        allowedUsers: selectedUsers,
      }),
      {
        loading: "Creating Festivity",
        success: (data: { data: { channelId: string } }) => {
          updateEvent()
          navigate(`channel/${data.data.channelId}`)
          return "Channel Created"
        },
        error: (err) => {
          console.log(err)
          return "Failed to create Channel"
        },
      },
    )
  }

  let usersToShow: OtherUserType[] = []
  switch (filterRole) {
    case "vendor":
      usersToShow = vendorUser
      break
    case "guest":
      usersToShow = guestUsers
      break
    case "all":
      usersToShow = combineList
      break
  }
  // const users = userList
  const filteredUsers = usersToShow

  const getUserRole = (user: OtherUserType) => {
    if (guestUsers.includes(user)) {
      return "guest"
    }
    if (vendorUser.includes(user)) {
      return "vendor"
    }
    return "guest"
  }

  return (
    <div className="h-[90vh] px-3 py-2 pb-8 w-full md:w-2/3 mx-auto">
      <button
        onClick={toggleDrawer(false)}
        className="flex w-full justify-end "
      >
        <IoIosCloseCircle className="text-3xl text-red-500" />
      </button>
      <TextField
        label="Channel Name"
        variant="outlined"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        fullWidth
        className="!mb-3 !mt-2"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: indigo[600],
            },
            "&:hover fieldset": {
              borderColor: indigo[800],
            },
            "&.Mui-focused fieldset": {
              borderColor: indigo[900],
            },
          },
        }}
      />
      <div className="mb-3 flex justify-center w-full sm:w-1/2 gap-2 px-2">
        <button
          onClick={() => setFilterRole("all")}
          className={`mr-2 w-1/3 ${
            filterRole === "all"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterRole("vendor")}
          className={`mr-2 w-1/3 ${
            filterRole === "vendor"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setFilterRole("guest")}
          className={`mr-2 w-1/3 ${
            filterRole === "guest"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          Guests
        </button>
      </div>
      <List className="h-[60vh] overflow-y-auto">
        {filteredUsers.map((user) => (
          <ListItem
            key={user._id}
            secondaryAction={
              <Checkbox
                edge="end"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelect(user._id)}
                sx={{
                  color: indigo[600],
                  "&.Mui-checked": {
                    color: indigo[600],
                  },
                }}
              />
            }
          >
            <ListItemAvatar>
              <Avatar src={user.profileImage}>{user.name[0]} </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <div>
                  <span>{user.email}</span>
                  <span className="capitalize">
                    {" "}
                    -{" "}
                    {filterRole === "all"
                      ? getUserRole(user)
                      : filterRole === "guest"
                        ? "Guest"
                        : "Vendor"}
                  </span>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
      <div className="mx-auto md:w-1/2">
        <Button
          text="Create Channel"
          onClick={handleCreateChannel}
          icon={<FaPlus />}
          wfull
        />
      </div>
    </div>
  )
}

export default CreateChannelDrawer
