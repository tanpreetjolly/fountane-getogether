import { useState } from "react"
import Button from "../components/Button"
import ServiceCard from "../components/ServiceCard"
import { useEventContext } from "@/context/EventContext"
import Loader from "@/components/Loader"
import { useNavigate } from "react-router-dom"
import { FaPlusCircle } from "react-icons/fa"
import { ServiceListType } from "@/definitions"

const ManageVendors = () => {
  const { event, loadingEvent } = useEventContext()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("all")

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

  const totalVendors = vendorList.length

  const renderVendors = (vendors: ServiceListType[]) => (
    <div className="grid md:grid-cols-2 gap-3 lg:grid-cols-3">
      {vendors.length === 0 ? (
        <span className="mx-auto">Nothing to show</span>
      ) : (
        vendors.map((vendor) => (
          <ServiceCard
            key={vendor._id}
            service={vendor}
            allPlanFromService={vendors.filter(
              (v) => v.servicesOffering._id === vendor.servicesOffering._id,
            )}
          />
        ))
      )}
    </div>
  )

  return (
    <div className="px-4 flex flex-col mt-1 gap-2 md:gap-4 lg:w-5/6 mx-auto">
      <div className="bg-white px-5 py-6 border shadow-sm rounded-2xl">
        <div className="text-xl md:text-2xl pl-1 text-gray-700">
          Manage Vendors for <br className="hidden md:block" />{" "}
          <span className="font-medium md:text-xl">{event.name}</span>
        </div>
        <div className="flex flex-wrap justify-between mt-4 items-centre">
          <div className="flex flex-wrap gap-1.5 items-center">
            <div className="bg-purpleShade bg-opacity-90 text-dark text-sm md:text-base px-3 py-1.5 rounded-xl">
              Total Vendors: {totalVendors}
            </div>
            <div className="bg-green-200 text-dark text-sm md:text-base px-3 py-1.5 rounded-xl">
              Hired: {hiredVendors.length}
            </div>
            <div className="bg-yellow-200 text-dark text-sm md:text-base px-3 py-1.5 rounded-xl">
              Pending: {invitedVendors.length}
            </div>
            <div className="bg-red-200 text-dark text-sm md:text-base px-3 py-1.5 rounded-xl">
              Rejected: {rejectedVendors.length}
            </div>
          </div>
          <div className=" mt-4 sm:mt-0  sm:mx-0 ">
            <Button
              text="Book a Vendor"
              onClick={() => navigate("search")}
              icon={<FaPlusCircle />}
              fontSize="text-sm md:text-base"
            />
          </div>
        </div>
      </div>
      <div className="p-4 md:p-5 bg-white bg-opacity-80 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between  pb-2 mb-4">
          <div className="text-lg">Your Vendors</div>
          <div className="flex justify-end text-sm space-x-1">
            <button
              className={`px-4 py-2 text-xs mt-2 md:mt-0 md:text-sm rounded-full ${
                selectedTab === "all" ? "bg-dark text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-xs mt-2 md:mt-0 md:text-sm rounded-full ${
                selectedTab === "hired" ? "bg-dark text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("hired")}
            >
              Hired
            </button>
            <button
              className={`px-4 py-2 text-xs mt-2 md:mt-0 md:text-sm rounded-full ${
                selectedTab === "pending" ? "bg-dark text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("pending")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 text-xs mt-2 md:mt-0 md:text-sm rounded-full ${
                selectedTab === "rejected"
                  ? "bg-dark text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("rejected")}
            >
              Rejected
            </button>
          </div>
        </div>

        {selectedTab === "all" && renderVendors(vendorList)}
        {selectedTab === "hired" && renderVendors(hiredVendors)}
        {selectedTab === "pending" && renderVendors(invitedVendors)}
        {selectedTab === "rejected" && renderVendors(rejectedVendors)}
      </div>
    </div>
  )
}

export default ManageVendors
