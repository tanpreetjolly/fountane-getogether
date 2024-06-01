import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Edit, X, Plus } from "lucide-react"
import { ServiceType } from "@/definitions"

const initialServiceData: ServiceType[] = [
  {
    _id: "1",
    serviceName: "Catering",
    serviceDescription: "Delicious catering services for your event",
    price: 500,
    items: [{ name: "Meal 1", description: "Description for Meal 1" }],
  },
  {
    _id: "2",
    serviceName: "Decor",
    serviceDescription: "Stunning decor to elevate your event",
    price: 1000,
    items: [{ name: "Item 1", description: "Description for Item 1" }],
  },
  {
    _id: "3",
    serviceName: "Photography",
    serviceDescription: "Capture the moment with our professional photography",
    price: 2000,
    items: [{ name: "Package 1", description: "Description for Package 1" }],
  },
]

const EditVendorServices = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  )
  const [serviceData, setServiceData] =
    useState<ServiceType[]>(initialServiceData)

  const handleServiceEdit = (service: ServiceType | null) => {
    if (service) {
      setSelectedService(service)
    } else {
      setSelectedService({
        _id: `${serviceData.length + 1}`,
        serviceName: "",
        serviceDescription: "",
        price: 0,
        items: [],
      })
    }
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedService(null)
  }

  const handleServiceUpdate = (updatedService: ServiceType) => {
    if (updatedService._id) {
      // Edit existing service
      const serviceIndex = serviceData.findIndex(
        (service) => service._id === updatedService._id,
      )
      if (serviceIndex !== -1) {
        const updatedServiceData = [...serviceData]
        updatedServiceData[serviceIndex] = updatedService
        // Update the serviceData state with the updated service
        setServiceData(updatedServiceData)
      }
    } else {
      // Create new service
      const newServiceId = `${serviceData.length + 1}`
      const newService = { ...updatedService, _id: newServiceId }
      // Update the serviceData state with the new service
      setServiceData([...serviceData, newService])
    }
    closeDrawer()
  }

  return (
    <div className="px-4">
      <h2 className="text-2xl font-semibold mb-4">My Services:</h2>
      <div className="flex justify-end mb-4">
        <Button variant="default" onClick={() => handleServiceEdit(null)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Service
        </Button>
      </div>
      <div className="space-y-3">
        {serviceData.map((service) => (
          <Accordion
            type="single"
            collapsible
            className="border rounded-md relative"
            key={service._id}
          >
            <AccordionItem value={service.serviceName}>
              <AccordionTrigger className="px-4 py-2 flex justify-between items-center">
                <div className="text-left w-4/5 space-y-1">
                  <h3 className="text-lg font-medium">{service.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.serviceDescription}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Price per Event: ${service.price}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleServiceEdit(service)}
                  className="absolute right-0 -top-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="space-y-2">
                  {service.items.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">
                          Item {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const updatedItems = [...service.items]
                            updatedItems.splice(index, 1)
                            setSelectedService({
                              ...service,
                              items: updatedItems,
                            })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <h3 className="text-lg font-semibold">
              {selectedService ? "Edit Service" : "Create New Service"}
            </h3>
            <Button variant="ghost" onClick={closeDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          {selectedService && (
            <div className="space-y-4 p-4 max-h-[80vh] overflow-autox ">
              <div>
                <Label htmlFor="serviceType" className="mb-2">
                  Service Type
                </Label>
                <Input
                  id="serviceType"
                  value={selectedService.serviceName}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      serviceName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="serviceDescription" className="mb-2">
                  Service Description
                </Label>
                <Input
                  id="serviceDescription"
                  value={selectedService.serviceDescription}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      serviceDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="servicePrice" className="mb-2">
                  Price per Event
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  value={selectedService.price}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      price: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                {selectedService.items.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">
                        Item {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const updatedItems = [...selectedService.items]
                          updatedItems.splice(index, 1)
                          setSelectedService({
                            ...selectedService,
                            items: updatedItems,
                          })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`itemName-${index}`} className="mb-2">
                          Item Name
                        </Label>
                        <Input
                          id={`itemName-${index}`}
                          value={item.name}
                          onChange={(e) => {
                            const updatedItems = [...selectedService.items]
                            updatedItems[index].name = e.target.value
                            setSelectedService({
                              ...selectedService,
                              items: updatedItems,
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`itemDescription-${index}`}
                          className="mb-2"
                        >
                          Item Description
                        </Label>
                        <Input
                          id={`itemDescription-${index}`}
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...selectedService.items]
                            updatedItems[index].description = e.target.value
                            setSelectedService({
                              ...selectedService,
                              items: updatedItems,
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newItem = { name: "", description: "" }
                    setSelectedService({
                      ...selectedService,
                      items: [...(selectedService?.items || []), newItem],
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>
          )}
          <DrawerFooter>
            <div className="flex justify-end">
              <Button variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleServiceUpdate(selectedService as ServiceType)
                }
              >
                Save
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default EditVendorServices
