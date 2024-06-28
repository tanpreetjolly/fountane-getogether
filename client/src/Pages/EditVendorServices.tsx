import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import { uploadImage as uploadImageAPI } from "@/api"
import { TbPhotoPlus } from "react-icons/tb"

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

  const [uploadingProfileImage, setLoadingProfileImage] = useState(false)

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

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoadingProfileImage(true)
      uploadImageAPI(e.target.files[0])
        .then(
          (response: {
            data: {
              imageUrl: string
            }
          }) => {
            console.log(response.data)
            setSelectedService({
              ...selectedService,
              serviceImage: response.data.imageUrl,
            })
          },
        )
        .catch((error) => console.log(error))
        .finally(() => {
          setLoadingProfileImage(false)
        })
    }
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
    <div className="p-5 w-full lg:w-5/6 mx-auto bg-white my-4  rounded-2xl">
      <div className="flex  flex-wrap justify-between items-center md:px-10">
        <h2 className="text-xl md:text-2xl font-medium mb-4">My Services:-</h2>
        <div className="flex justify-end mb-4">
          <Button variant="default" onClick={() => handleServiceEdit(null)}>
            <Plus className="h-4 w-4 mr-2" /> Create New Service
          </Button>
        </div>
      </div>
      <div className="space-y-4 mt-7 md:px-10">
        {serviceData.map((service) => (
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg relative "
            key={service._id}
          >
            <AccordionItem value={service.serviceName}>
              <AccordionTrigger className="px-4 py-2 flex justify-between items-center">
                <div className="text-left w-4/5 space-y-2 py-3">
                  <h3 className="text-lg font-medium">{service.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.serviceDescription}
                  </p>
                  <p className="text-sm bg-purpleShade bg-opacity-80 text-slate-80 w-fit px-3 rounded-lg font-normal py-0.5 ">
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
                <p className="p-1 font-medium ">
                  Plans for {service.serviceName}
                </p>
                <div className="space-y-2">
                  {service.items.map((item) => (
                    <div key={item._id} className="border rounded-md p-3 w-4/5">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-">{item.name}</h4>
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
        <DrawerContent className="max-h-[90vh] overflow-y-hidden lg:w-5/6 mx-auto  md:px-10">
          <DrawerHeader className="flex items-center justify-between border-b mx-2">
            <h3 className="text-xl font-medium">
              {selectedService ? "Edit Service" : "Create New Service"}
            </h3>
            <Button variant="ghost" onClick={closeDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          {selectedService && (
            <div className="p-4 max-h-[80vh] overflow-auto ">
              <div className="grid md:grid-cols-2 gap-2 mb-4">
                <div>
                  <Label htmlFor="serviceType" className="mb-2">
                    Service Type
                  </Label>
                  <Input
                    className="bg-white"
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
                    className="bg-white"
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
                <div className="">
                  <Label htmlFor="serviceImage" className="mb-2">
                    Service Image URL
                  </Label>
                  <div className="flex gap-2 p-1 items-center">
                    <img
                      src={selectedService.serviceImage}
                      alt={selectedService.serviceName || "No Image"}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    {uploadingProfileImage && (
                      <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-50">
                        <Loader />
                      </div>
                    )}
                    <label
                      htmlFor="file-upload"
                      className="w-fit flex gap-1 text-sm border rounded-lg py-2 px-5 cursor-pointer hover:border-highlight duration-150 mx-auto md:ml-0"
                    >
                      <TbPhotoPlus className="my-auto text-base" />
                      Upload Image
                    </label>
                    <Input
                      id="file-upload"
                      className="hidden"
                      type="file"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={uploadImage}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selectedService.items.map((item, index) => (
                  <div
                    key={item._id}
                    className="border rounded-md p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">
                        Plan {index + 1}
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
                    <div className=" gap-3 grid md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <Label
                          htmlFor={`itemName-${item._id}`}
                          className="mb-2"
                        >
                          Plan Name
                        </Label>
                        <Input
                          className="bg-white"
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
                          Plan Description
                        </Label>
                        <Input
                          className="bg-white"
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
                          Plan Price
                        </Label>
                        <Input
                          className="bg-white"
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
                  className="mt-4"
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
            <div className="flex justify-end gap-1">
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
