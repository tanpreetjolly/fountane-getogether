import { IoPeopleSharp } from "react-icons/io5"
import Button from "../components/Button"
import ServiceCard from "../components/ServiceCard"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { useNavigate } from "react-router-dom"

const ManageVendors = () => {
  const { event, loadingEvent } = useEventContext()
  const navigate = useNavigate()

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>

  const vendorList = event.serviceList

  const hiredVendors = vendorList.filter(
    (vendor) => vendor.status === "accepted",
  )
  const invitedVendors = vendorList.filter(
    (vendor) => vendor.status === "pending",
  )
  const rejectedVendors = vendorList.filter(
    (vendor) => vendor.status === "rejected",
  )

  return (
    <div className="px-4 divide-y space-y-2 py-2 lg:w-4/5 mx-auto">
      {event.isHosted && (
        <Button
          text="Book a Vendor"
          onClick={() => navigate("search")}
          icon={<IoPeopleSharp />}
        />
      )}
      <div className="pt-2">
        <div className="font-medium text-gray-800 px-2 text-xl">
          Hired Vendors
        </div>
        <div className="flex flex-col gap-2 py-2">
          {hiredVendors.length === 0 && (
            <span className="mx-auto">No vendors hired yet</span>
          )}
          {hiredVendors.map((vendor) => (
            <ServiceCard key={vendor.subEvent._id} service={vendor} />
          ))}
        </div>
        {event.isHosted && (
          <>
            <div className="font-medium text-gray-800 px-2 text-xl mt-4">
              Invited Vendors
            </div>
            <div className="flex flex-col gap-2 py-2">
              {invitedVendors.length === 0 && (
                <span className="mx-auto">Nothing to show</span>
              )}
              {invitedVendors.map((vendor) => (
                <ServiceCard key={vendor.subEvent._id} service={vendor} />
              ))}
            </div>
            <div className="font-medium text-gray-800 px-2 text-xl mt-4">
              Rejected Vendors
            </div>
            <div className="flex flex-col gap-2 py-2">
              {rejectedVendors.length === 0 && (
                <span className="mx-auto">Nothing to show</span>
              )}
              {rejectedVendors.map((vendor) => (
                <ServiceCard key={vendor.subEvent._id} service={vendor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ManageVendors
