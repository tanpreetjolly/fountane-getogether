import { useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography"

type Props = {}

const vendorData = [
  {
    _id: "11",
    name: "Shivam Caterers",
    type: "food",
    status: "invite",
  },
  {
    _id: "21",
    name: "Vanish Caterings",
    type: "food",
    status: "invite",
  },
  {
    _id: "31",
    name: "Event Managers Inc.",
    type: "event management",
    status: "invited",
  },
  {
    _id: "41",
    name: "Dhillon Managers Inc.",
    type: "event management",
    status: "invited",
  },
]

const AssignVendors = (_props: Props) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const handleVendorChange = (vendor_Id: string) => {
    setSelectedVendors((prevSelectedVendors) =>
      prevSelectedVendors.includes(vendor_Id)
        ? prevSelectedVendors.filter((_id) => _id !== vendor_Id)
        : [...prevSelectedVendors, vendor_Id],
    )
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom className="text-center">
        Assign Vendors for the Festivity
      </Typography>
      <List>
        {vendorData.map((vendor) => (
          <ListItem
            key={vendor._id}
            secondaryAction={
              <Checkbox
                color="secondary"
                edge="end"
                checked={selectedVendors.includes(vendor._id)}
                onChange={() => handleVendorChange(vendor._id)}
              />
            }
          >
            <ListItemText
              primary={vendor.name}
              secondary={`Type: ${vendor.type}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default AssignVendors
