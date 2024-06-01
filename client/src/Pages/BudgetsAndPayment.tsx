import { useState } from "react"
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import Button from "../components/Button"
import { MdCancel } from "react-icons/md"
import { SiTicktick } from "react-icons/si"
import { CheckCheck, CircleDot, SquarePen } from "lucide-react"
import { useEventContext } from "../context/EventContext"
import Loader from "../components/Loader"
import { ServiceListType } from "@/definitions"
import toast from "react-hot-toast"
import { updateEventBudget } from "@/api"

const calculateBudgetUtilized = (serviceList: ServiceListType[]): number => {
  return parseFloat(
    serviceList.reduce((acc, service) => acc + service.amount, 0).toFixed(2),
  )
}

type GroupedServices = {
  [vendorId: string]: {
    vendorName: string
    services: ServiceListType[]
  }
}

interface Props {}

const BudgetsAndPayment: React.FC<Props> = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [newTotalBudget, setNewTotalBudget] = useState<number>(0)

  const { event, loadingEvent, updateEvent } = useEventContext()

  if (loadingEvent) return <Loader />
  if (!event) return null

  const handleOpenModal = () => {
    setNewTotalBudget(event.budget)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const handleTotalBudgetChange = () => {
    toast.promise(updateEventBudget(event._id, newTotalBudget), {
      loading: "Updating Budget...",
      success: "Budget Updated Successfully",
      error: "Failed to update Budget",
    })
    updateEvent()
    handleCloseModal()
  }

  const groupedServices: GroupedServices =
    event.serviceList.reduce<GroupedServices>((acc, service) => {
      const vendorId = service.vendorProfile._id
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorName: service.vendorProfile.user.name,
          services: [],
        }
      }
      acc[vendorId].services.push(service)
      return acc
    }, {})

  return (
    <div className="px-4">
      <Box>
        <h2 className="text-xl text-gray-900 px-1 font-medium">
          Manage Budget
        </h2>
        <div className="flex gap-2 mt-2 mb-6 items-center justify-end font-roboto">
          <div className="  w-1/2 relative  p-4 rounded-lg  bg-slate-800 text-white">
            <div className="text-sm text-gray-200 pl-0.5">Total Budget</div>
            <div className="text-2xl font-semibold mt-0.5 ">
              ${event.budget}
            </div>
            <button
              className="absolute top-3 right-3"
              onClick={handleOpenModal}
            >
              <SquarePen size={18} />
            </button>
          </div>
          <div className=" border w-1/2 relative  p-4 rounded-lg bg-indigo-500 text-white">
            <div className="text-sm text-gray-200 pl-0.5">Available Budget</div>
            <div className="text-2xl font-medium mt-0.5  ">
              {(
                event.budget - calculateBudgetUtilized(event.serviceList)
              ).toFixed(2)}
            </div>
          </div>
        </div>

        <h2 className="text-xl text-gray-900 px-1 font-medium mb-2 ">
          Manage Payments
        </h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {Object.entries(groupedServices).map(
            ([vendorId, { vendorName, services }]) => {
              return (
                <div key={vendorId} className="border p-4 rounded-md">
                  <h3 className="text-base text-gray-900 px-1 font-medium mb-2 ">
                    {vendorName}
                  </h3>
                  {services.map((services) => (
                    <div
                      key={services._id}
                      className="border p-5 rounded-xl shadow-sm my-1"
                    >
                      <div className="flex justify-between items-start">
                        <Box>
                          <div className="text-lg font-medium">
                            {services.servicesOffering.serviceName + " "}
                          </div>
                          <div>{services.subEvent.name}</div>
                          <div className="text-gray-700 mt-1">
                            Payment: ${services.amount}
                          </div>
                        </Box>
                        <div
                          className={`p-1 px-3 capitalize rounded-full text-white font-medium flex items-center text-sm font-inter ${services.paymentStatus === "paid" ? "bg-green-500" : services.paymentStatus === "failed" ? "bg-red-500" : "bg-amber-500"}`}
                        >
                          {services.paymentStatus == "pending" ? (
                            <CircleDot className="inline mr-1" size={16} />
                          ) : (
                            <CheckCheck className="inline mr-1" size={16} />
                          )}
                          {services.paymentStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            },
          )}
        </Box>
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Edit Total Budget</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Total Budget"
              variant="outlined"
              type="number"
              value={newTotalBudget}
              className="!mt-2"
              onChange={(e) => setNewTotalBudget(Number(e.target.value))}
            />
          </DialogContent>
          <div className="grid grid-cols-2 p-3 pt-0 gap-2 px-6">
            <Button
              onClick={handleCloseModal}
              text="Cancel"
              icon={<MdCancel />}
            />
            <Button
              onClick={handleTotalBudgetChange}
              text="Save"
              icon={<SiTicktick />}
            />
          </div>
        </Dialog>
      </Box>
    </div>
  )
}

export default BudgetsAndPayment
