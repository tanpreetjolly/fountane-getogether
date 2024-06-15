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
import { PieChart, Pie, Cell } from "recharts"

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

const CustomTabs: React.FC<{ labels: string[], currentTab: number, onChange: (index: number) => void }> = ({ labels, currentTab, onChange }) => {
  return (
    <div className="flex space-x-1">
      {labels.map((label, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-full text-sm ${currentTab === index ? "bg-dark text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => onChange(index)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const BudgetsAndPayment: React.FC<Props> = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [newTotalBudget, setNewTotalBudget] = useState<number>(0)
  const [currentTab, setCurrentTab] = useState<number>(0)

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

  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue)
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

  const totalBudget = event.budget
  const utilizedBudget = calculateBudgetUtilized(event.serviceList)
  const remainingBudget = totalBudget - utilizedBudget
  const spentPercentage = (utilizedBudget / totalBudget) * 100

  const data = [
    { name: "Spent Budget", value: utilizedBudget },
    { name: "Remaining Budget", value: remainingBudget },
  ]

  const COLORS = ["#aecaf4", "#E0E0E0"]

  const filterServices = (status: string) => {
    return event.serviceList.filter(
      (service) => service.paymentStatus === status,
    )
  }

  
  return (
    <div className="p-4 mx-auto lg:w-5/6">
      <div className="">
        <div className=" bg-white border shadow-sm px-4 py-6 rounded-2xl">
          <h2 className="text-2xl pl-1 text-gray-900  font-medium">
            Compound Budget
          </h2>
          <div className="pl-1 text-gray-700">for {event.name}</div>
          <div className="flex gap-2 mt-2 items-  lg:w-3/5">
            <div className="  w-[30%] relative  p-3.5  rounded-3xl flex flex-col gap-1 bg-opacity-80 bg-blueShade text-slate-800">
              <div className="text-center">
                <span className="mx-auto text-sm  text-slate-800 ">
                  Available Budget
                </span>
                <div className="text-center font-medium text-2xl">
                  $
                  {(
                    event.budget - calculateBudgetUtilized(event.serviceList)
                  ).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center  justify-center text-gray-200  rounded-xl bg-opacity-90 px-3 py-1 text-[13px] bg-dark">
                <div className=" pl-0.5">Total Budget</div>
                <div className=" text-white mt-0.5 ml-1.5">${event.budget}</div>
                <button className="pl-1 text-white" onClick={handleOpenModal}>
                  <SquarePen size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className=" border w-1/5  justify-center rounded-3xl relative shadow-sm flex flex-col items-center">
              <PieChart width={90} height={90}>
                <Pie
                  data={data}
                  innerRadius={38}
                  outerRadius={45}
                  fill="white"
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-xs text-slate-800 text-center absolute  font-medium">
                Spent <br /> {spentPercentage.toFixed(2)}%
              </div>
            </div>

            <div className=" border w-1/4 p-5 rounded-3xl bg-yellowShade relative bg-opacity-90 shadow-sm flex flex-col ">
              <div className="text-">
                <span className="mx-auto text-sm  text-slate-800 ">
                  Completed <br /> Payments
                </span>
                <div className="text- font-medium text-2xl">
                  $
                  {(
                    event.budget - calculateBudgetUtilized(event.serviceList)
                  ).toFixed(2)}
                </div>
              </div>
            </div>
            <div className=" border w-1/4 p-5 rounded-3xl bg-purpleShade relative bg-opacity-85 shadow-sm flex flex-col ">
              <div className="text-">
                <span className="mx-auto text-sm  text-slate-800 ">
                  Pending <br /> Payments
                </span>
                <div className="text- font-medium text-2xl">
                  $
                  {(
                    event.budget - calculateBudgetUtilized(event.serviceList)
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white mt-4 rounded-2xl border shadow-sm">
          <h2 className="text-xl text-gray-900 px-1 font-medium mb-2 ">
            Manage Payments
          </h2>
          <CustomTabs
            labels={["Paid", "Failed", "Pending"]}
            currentTab={currentTab}
            onChange={handleTabChange}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            {Object.entries(groupedServices).map(
              ([vendorId, { vendorName, services }]) => {
                const filteredServices = services.filter((service) => {
                  if (currentTab === 0) return service.paymentStatus === "paid"
                  if (currentTab === 1) return service.paymentStatus === "failed"
                  return service.paymentStatus === "pending"
                })

                if (filteredServices.length === 0) return null

                return (
                  <div key={vendorId} className="bg-gray-50 shadow-sm p-3 rounded-md ">
                    <h3 className="text-base bg-blueShade text-gray-800  font-medium w-fit rounded-lg px-3 py-1 mb-2 ">
                      {vendorName}
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredServices.map((service) => (
                      <div
                        key={service._id}
                        className="border p-4  bg-white rounded-xl shadow-sm my-1"
                      >
                        <div className="flex justify-between items-start">
                          <Box>
                            <div className="">
                              {service.servicesOffering.serviceName + " "}
                            </div>
                            <div className="text-sm text-slate-600">{service.subEvent.name}</div>
                            <div className="text-gray-900 mt-4  bg-yellowShade px-3 text-sm rounded-lg py-1">
                              Payment: ${service.amount}
                            </div>
                          </Box>
                          <div
                            className={`p-1 px-3 capitalize rounded-full  font-medium flex items-center text-sm  ${service.paymentStatus === "paid" ? "text-green-500" : service.paymentStatus === "failed" ? "text-red-500" : "text-amber-500"}`}
                          >
                            {service.paymentStatus == "pending" ? (
                              <CircleDot className="inline mr-1" size={16} />
                            ) : (
                              <CheckCheck className="inline mr-1" size={16} />
                            )}
                            {service.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )
              },
            )}
          </Box>
        </div>
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
      </div>
    </div>
  )
}

export default BudgetsAndPayment
