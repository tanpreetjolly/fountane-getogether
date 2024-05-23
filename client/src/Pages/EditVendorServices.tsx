import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import TextField from "@mui/material/TextField"

interface Service {
  id: string
  type: string
  price: number
}

const serviceData: Service[] = [
  { id: "1", type: "Catering", price: 500 },
  { id: "2", type: "Decor", price: 1000 },
  { id: "3", type: "Photography", price: 2000 },
]

type Props = {}

const EditVendorServices = (_props: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleServiceEdit = (service: Service) => {
    setSelectedService(service)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedService(null)
  }

  const handleServiceUpdate = (updatedService: Service) => {
    // Implement your logic to update the service data here
    console.log("Updated Service:", updatedService)
    closeDrawer()
  }

  return (
    <div className="px-4">
      <Typography variant="h6" gutterBottom>
        My Services :
      </Typography>
      <List>
        {serviceData.map((service) => (
          <ListItem
            key={service.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleServiceEdit(service)}
              >
                <EditIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={service.type}
              secondary={`Price per Event: $${service.price}`}
            />
          </ListItem>
        ))}
      </List>
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Edit Service</Typography>
          <IconButton onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        {selectedService && (
          <Box sx={{ p: 2 }}>
            <TextField
              label="Service Type"
              value={selectedService.type}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  type: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price per Event"
              type="number"
              value={selectedService.price}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  price: parseInt(e.target.value, 10) || 0,
                })
              }
              fullWidth
              margin="normal"
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={() => handleServiceUpdate(selectedService)}
                color="primary"
                size="small"
              >
                Save
              </IconButton>
            </Box>
          </Box>
        )}
      </SwipeableDrawer>
    </div>
  )
}

export default EditVendorServices
