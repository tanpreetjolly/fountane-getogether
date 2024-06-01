import { useMemo, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Button from "@/components/Button"
import { FaPlusCircle } from "react-icons/fa"
import Loader from "@/components/Loader"
import { useEventContext } from "@/context/EventContext"
import { useParams } from "react-router-dom"
import { Avatar, ListItemAvatar } from "@mui/material"
import { Input } from "@/components/ui/input"
import { addRemoveGuestsToSubEvent } from "@/api"
import toast from "react-hot-toast"

const InviteGuests = () => {
  const [toggledGuests, setToggledGuests] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const { event, loadingEvent, updateEvent } = useEventContext()
  const { subEventId } = useParams()

  const userList = useMemo(() => {
    if (!event) return []
    if (!subEventId) return []

    return event.userList
      .filter((user) => user.subEvents.includes(subEventId))
      .map((guest) => guest.user._id)
  }, [event, subEventId])

  const handleGuestChange = (guestId: string) => {
    setToggledGuests((prevSelectedGuests) =>
      prevSelectedGuests.some((user) => user === guestId)
        ? prevSelectedGuests.filter((user) => user !== guestId)
        : [...prevSelectedGuests, guestId],
    )
  }

  const isAlreadyInvited = (guestId: string) => {
    return userList.includes(guestId)
  }

  const handleSaveGuests = async () => {
    if (!event) return
    if (!subEventId) return

    toast.promise(
      addRemoveGuestsToSubEvent(event._id, subEventId, {
        guestIds: toggledGuests,
      }),
      {
        loading: "Saving Guests...",
        success: (data) => {
          console.log(data)
          updateEvent()
          setToggledGuests([])
          return "Guests Saved Successfully"
        },
        error: (error) => {
          console.log(error)
          return "Error Saving Guests"
        },
      },
    )
  }

  const filteredUserList =
    event?.userList
      // .map((guest) => guest.user)
      .filter((guest) =>
        guest.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  if (!subEventId) return <div>No SubEvent Found</div>

  return (
    <div className="px-4 my-2 mb-12 flex flex-col h-[85vh] justify-between">
      <div>
        <div className="text-2xl pl-1 font-semibold text-zinc-800">
          Invite Guests for the Festivity
        </div>
        <Input
          type="search"
          placeholder="Search guests..."
          className="my-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List>
          {filteredUserList.map((guest) => (
            <ListItem key={guest.user._id}>
              <ListItemAvatar>
                <Avatar src={guest.user.profileImage} className="mr-3">
                  {guest.user.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={guest.user.name}
                secondary={
                  <span>
                    Email: {guest.user.email}
                    <br />
                    PhoneNo: {guest.user.phoneNo}
                  </span>
                }
                secondaryTypographyProps={{ className: "pl-1" }}
              />
              {isAlreadyInvited(guest.user._id) && (
                <span className="text-green-500 capitalize">
                  {guest.status}
                </span>
              )}
              <Checkbox
                color="secondary"
                edge="end"
                checked={
                  toggledGuests.includes(guest.user._id)
                    ? !isAlreadyInvited(guest.user._id)
                    : isAlreadyInvited(guest.user._id)
                }
                onChange={() => handleGuestChange(guest.user._id)}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <Button
        text="Save Selected Guests"
        onClick={handleSaveGuests}
        icon={<FaPlusCircle />}
      />
    </div>
  )
}

export default InviteGuests
