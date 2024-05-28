import { useState } from "react"
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import { FaEdit } from "react-icons/fa"
import Button from "../components/Button"
import { MdCancel } from "react-icons/md"
import { SiTicktick } from "react-icons/si"
import { CheckCheck, CircleDot, Ellipsis, SquarePen } from "lucide-react"
import { useEventContext } from "../context/EventContext"
import Loader from "../components/Loader"
interface Festivity {
  id: string
  name: string
  payment: number
  status: string
}

const initialBudget = 10000
const initialFestivities: Festivity[] = [
  { id: "1", name: "Wedding", payment: 5000, status: "Paid" },
  { id: "2", name: "Birthday", payment: 2000, status: "Pending" },
  { id: "3", name: "Anniversary", payment: 1500, status: "Paid" },
  { id: "4", name: "Corporate Event", payment: 1000, status: "Pending" },
]

const calculateAvailableBudget = (
  totalBudget: number,
  festivities: Festivity[],
): number => {
  const totalPayments = festivities.reduce(
    (sum, festivity) => sum + festivity.payment,
    0,
  )
  return totalBudget - totalPayments
}

interface Props {}

const BudgetsAndPayment: React.FC<Props> = () => {
  const { event, loadingEvent } = useEventContext()
  const [totalBudget, setTotalBudget] = useState<number>(initialBudget)
  const [availableBudget, setAvailableBudget] = useState<number>(
    calculateAvailableBudget(initialBudget, initialFestivities),
  )
  const [festivities, _setFestivities] =
    useState<Festivity[]>(initialFestivities)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [newTotalBudget, setNewTotalBudget] = useState<number>(totalBudget)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleTotalBudgetChange = () => {
    setTotalBudget(newTotalBudget)
    setAvailableBudget(calculateAvailableBudget(newTotalBudget, festivities))
    handleCloseModal()
  }
  if (loadingEvent)
    return (
      <div>
        <Loader />
      </div>
    )
  if (event == null) return null
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
              ${availableBudget}
            </div>
          </div>
        </div>

        <h2 className="text-xl text-gray-900 px-1 font-medium mb-2 ">
          Manage Payments
        </h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {festivities.map((festivity) => (
            <div
              key={festivity.id}
              className="border p-5  rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start">
                <Box>
                  <div className="text-lg font-medium">{festivity.name}</div>
                  <div className="text-gray-700 mt-1 ">
                    Payment: ${festivity.payment}
                  </div>
                </Box>
                <div
                  className={`p-1 px-3 rounded-full text-white font-medium flex items-center text-sm font-inter ${festivity.status.toLowerCase() == "paid" ? "bg-green-500" : "bg-amber-500"}`}
                >
                  {festivity.status == "Pending" ? (
                    <CircleDot className="inline mr-1" size={16} />
                  ) : (
                    <CheckCheck className="inline mr-1" size={16} />
                  )}
                  {festivity.status}
                </div>
              </div>
            </div>
          ))}
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
