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
import { useAppDispatch, useAppSelector } from "@/hooks"
import Loader from "@/components/Loader"
import { createService, updateService } from "@/api"
import toast from "react-hot-toast"
import { loadUser } from "@/features/userSlice"

const newService: ServiceType = {
  _id: "new",
  serviceName: "",
  serviceDescription: "",
  serviceImage: "",
  items: [],
}

const EditVendorServices = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedService, setSelectedService] =
    useState<ServiceType>(newService)

  const { user, loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  if (loading) return <Loader />
  if (!user) return <div>Not logged in</div>
  if (!user.vendorProfile) return <div>Not a vendor</div>
  const serviceData = user.vendorProfile.services

  const handleServiceEdit = (service: ServiceType | null) => {
    if (service) {
      setSelectedService(service)
    } else {
      setSelectedService(newService)
    }
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedService(newService)
  }

  const handleServiceUpdate = (updatedService: ServiceType | null) => {
    console.log(updatedService)
    console.log(user.vendorProfile?._id)
    if (!updatedService) return
    if (user.vendorProfile?._id === undefined) return
    if (updatedService._id === "new") {
      //remove all _ids from items
      const createServiceVale: Omit<ServiceType, "_id" | "items"> & {
        items: Omit<ServiceType["items"][0], "_id">[]
      } = {
        serviceName: updatedService.serviceName,
        serviceDescription: updatedService.serviceDescription,
        serviceImage: updatedService.serviceImage,
        items: updatedService.items.map((item) => ({
          name: item.name,
          description: item.description,
          price: item.price,
        })),
      }
      toast.promise(createService(user.vendorProfile?._id, createServiceVale), {
        loading: "Updating service...",
        success: (data) => {
          console.log(data)
          closeDrawer()
          dispatch(loadUser(false))
          return "Service created successfully"
        },
        error: (error) => {
          console.error(error)
          return "Failed to create service"
        },
      })
    } else {
      // Edit existing service
      const serviceIndex = serviceData.findIndex(
        (service) => service._id === updatedService._id,
      )
      if (serviceIndex !== -1) {
        const updatedServiceData = [...serviceData]
        updatedServiceData[serviceIndex] = updatedService
        // Update the serviceData state with the updated service
        // setServiceData(updatedServiceData)
        toast.promise(
          updateService(
            user.vendorProfile?._id,
            serviceData[serviceIndex]._id,
            updatedService,
          ),
          {
            loading: "Updating service...",
            success: (data) => {
              console.log(data)
              closeDrawer()
              dispatch(loadUser(false))
              return "Service updated successfully"
            },
            error: (error) => {
              console.error(error)
              return "Failed to update service"
            },
          },
        )
      }
    }
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
                    Starting Price $
                    {Math.min(...service.items.map((item) => item.price))}
                  </p>
                </div>
                <img
                  src={service.serviceImage}
                  alt={service.serviceName}
                  className="w-20 h-20 object-cover rounded-md"
                />
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
                  {service.items.map((item) => (
                    <div key={item._id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
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
            <div className="space-y-4 p-4 max-h-[80vh] overflow-auto ">
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
                <Label htmlFor="serviceImage" className="mb-2">
                  Service Image URL
                </Label>
                <img
                  src={selectedService.serviceImage}
                  alt={selectedService.serviceName}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <Input
                  id="serviceImage"
                  type="string"
                  value={selectedService.serviceImage}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      serviceImage: e.target.value,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                {selectedService.items.map((item, index) => (
                  <div key={item._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">
                        Item {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedService((p) => {
                            const updatedItems = p.items.filter(
                              (i) => i._id !== item._id,
                            )
                            return {
                              ...p,
                              items: updatedItems,
                            }
                          })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label
                          htmlFor={`itemName-${item._id}`}
                          className="mb-2"
                        >
                          Item Name
                        </Label>
                        <Input
                          id={`itemName-${item._id}`}
                          value={item.name}
                          onChange={(e) => {
                            e.preventDefault()
                            setSelectedService((p) => {
                              const updatedItems = p.items.map((i) => {
                                if (i._id === item._id) {
                                  return { ...i, name: e.target.value }
                                }
                                return i
                              })
                              return {
                                ...p,
                                items: updatedItems,
                              }
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`itemDescription-${item._id}`}
                          className="mb-2"
                        >
                          Item Description
                        </Label>
                        <Input
                          id={`itemDescription-${item._id}`}
                          value={item.description}
                          onChange={(e) => {
                            e.preventDefault()
                            setSelectedService((p) => {
                              const updatedItems = p.items.map((i) => {
                                if (i._id === item._id) {
                                  return { ...i, description: e.target.value }
                                }
                                return i
                              })
                              return {
                                ...p,
                                items: updatedItems,
                              }
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`itemPrice-${item._id}`}
                          className="mb-2"
                        >
                          Item Price
                        </Label>
                        <Input
                          id={`itemPrice-${item._id}`}
                          value={item.price}
                          type="number"
                          onChange={(e) => {
                            e.preventDefault()
                            setSelectedService((p) => {
                              const updatedItems = p.items.map((i) => {
                                if (i._id === item._id) {
                                  return {
                                    ...i,
                                    price: parseFloat(e.target.value),
                                  }
                                }
                                return i
                              })
                              return {
                                ...p,
                                items: updatedItems,
                              }
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
                    const newItem = {
                      _id: `new-${selectedService.items.length}`,
                      isNew: true,
                      name: "",
                      description: "",
                      price: 0,
                    }
                    setSelectedService({
                      ...selectedService,
                      items: [...selectedService.items, newItem],
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
              <Button onClick={() => handleServiceUpdate(selectedService)}>
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
