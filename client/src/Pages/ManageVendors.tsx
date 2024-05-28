import { IoPeopleSharp } from "react-icons/io5"
import Button from "../components/Button"
import VendorCard from "../components/VendorCard"
import { useNavigate, useParams } from "react-router-dom"

const vendorData = [
  {
    id: "11",
    name: "Shivam Caterers",
    type: "food",
    status: "hired",
    events: ["100", "200", "300", "400"],
  },
  {
    id: "21",
    name: "Vanish Caterings",
    type: "food",
    status: "hired",
    events: ["100", "200", "300", "400"],
  },
  {
    id: "31",
    name: "Event Managers Inc.",
    type: "event management",
    status: "invited",
    events: ["100", "200", "300", "400"],
  },
  {
    id: "41",
    name: "Dhillon Managers Inc.",
    type: "event management",
    status: "invited",
    events: ["100", "200", "300", "400"],
  },
]

const ManageVendors = () => {
  const hiredVendors = vendorData.filter((vendor) => vendor.status === "hired")
  const invitedVendors = vendorData.filter(
    (vendor) => vendor.status === "invited",
  )
  console.log(hiredVendors)
  const navigate = useNavigate()
  return (
    <div className="px-4 divide-y space-y-2">
      <Button
        text="Book a Vendor"
        onClick={() => navigate("search")}
        icon={<IoPeopleSharp />}
      />
      <div className="pt-2">
        <div className="font-medium text-gray-800 px-2 text-xl">
          Hired Vendors
        </div>
        <div className="flex flex-col gap-2 py-2">
          {hiredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        <div className="font-medium text-gray-800 px-2 text-xl mt-4">
          Invited Vendors
        </div>
        <div className="flex flex-col gap-2 py-2">
          {invitedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={() => navigate(`${vendor.id}/chat`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageVendors
