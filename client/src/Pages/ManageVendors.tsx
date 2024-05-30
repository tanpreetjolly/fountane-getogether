import { IoPeopleSharp } from "react-icons/io5"
import Button from "../components/Button"
import VendorCard from "../components/VendorCard"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { useNavigate } from "react-router-dom"

const ManageVendors = () => {
  const { event, loadingEvent } = useEventContext()
  const navigate = useNavigate()

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const vendorList = event.vendorList
    .map((vendor) => {
      const subEvents = vendor.subEvents.map((subEvent) => {
        return {
          subEvent: subEvent.subEvent,
          vendor: vendor.vendorProfile.user,
          status: subEvent.status,
          servicesOffering: subEvent.servicesOffering,
        }
      })
      return subEvents
    })
    .flat()

  console.log(vendorList)

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
          {vendorList.map((vendor) => {
            if (vendor.status !== "accepted") return null
            return <VendorCard key={vendor.subEvent._id} vendor={vendor} />
          })}
        </div>

        <div className="font-medium text-gray-800 px-2 text-xl mt-4">
          Invited Vendors
        </div>
        <div className="flex flex-col gap-2 py-2">
          {vendorList.map((vendor) => {
            if (vendor.status !== "pending") return null
            return <VendorCard key={vendor.subEvent._id} vendor={vendor} />
          })}
        </div>
        <div className="font-medium text-gray-800 px-2 text-xl mt-4">
          Rejected Vendors
        </div>
        <div className="flex flex-col gap-2 py-2">
          {vendorList.map((vendor) => {
            if (vendor.status !== "rejected") return null
            return <VendorCard key={vendor.subEvent._id} vendor={vendor} />
          })}
        </div>
      </div>
    </div>
  )
}

export default ManageVendors
