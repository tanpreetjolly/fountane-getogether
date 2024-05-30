import { useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography"
import { VendorListType } from "@/definitions"
import { useEventContext } from "@/context/EventContext"
import { Loader } from "lucide-react"
import { useParams } from "react-router-dom"

interface AssignVendorsType {
  vendorProfileId: string
  serviceId: string
}

const AssignVendors = () => {
  const [selectedVendors, setSelectedVendors] = useState<AssignVendorsType[]>(
    [],
  )

  const { event, loadingEvent } = useEventContext()
  const { subEventId } = useParams()

  useEffect(() => {
    if (!event) return
    if (!subEventId) return
    // const userList = event.userList
    //   .filter((user) => user.subEvents.includes(subEventId))
    //   .map((guest) => guest.user)

    const vendorSelected: AssignVendorsType[] = []
    event.vendorList.forEach((vendor: VendorListType) => {
      vendor.subEvents.forEach((subEvent) => {
        if (subEvent._id === subEventId) {
          subEvent.servicesOffering.forEach((serviceId) => {
            vendorSelected.push({
              vendorProfileId: vendor.vendorProfile._id,
              serviceId,
            })
          })
        }
      })
    })

    setSelectedVendors(vendorSelected)
  }, [event, loadingEvent, subEventId])

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  if (!subEventId) return <div>No SubEvent Found</div>

  const handleVendorChange = (vendorProfileId: string, serviceId: string) => {
    setSelectedVendors((prevSelectedVendors) =>
      prevSelectedVendors.some(
        (p) =>
          p.vendorProfileId === vendorProfileId && p.serviceId === serviceId,
      )
        ? prevSelectedVendors.filter(
            (p) =>
              p.vendorProfileId !== vendorProfileId &&
              p.serviceId !== serviceId,
          )
        : [...prevSelectedVendors, { vendorProfileId, serviceId }],
    )
  }

  const vendorList = event.vendorList

  return (
    <div>
      <Typography variant="h6" gutterBottom className="text-center">
        Assign Vendors for the Festivity
      </Typography>
      <List>
        {vendorList.map((vendor) => (
          <ListItem key={vendor._id}>
            <ListItemText
              primary={vendor.vendorProfile.user.name}
              // secondary={`Type: ${vendor.vendor.services}`}
              secondary={
                <List>
                  {vendor.vendorProfile.services.map((service) => (
                    <ListItem
                      key={service._id}
                      secondaryAction={
                        <Checkbox
                          color="secondary"
                          edge="end"
                          checked={selectedVendors.some(
                            (p) =>
                              p.vendorProfileId === vendor.vendorProfile._id &&
                              p.serviceId === service._id,
                          )}
                          onChange={() =>
                            handleVendorChange(
                              vendor.vendorProfile._id,
                              service._id,
                            )
                          }
                        />
                      }
                    >
                      <ListItemText primary={service.serviceName} />
                    </ListItem>
                  ))}
                </List>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default AssignVendors
