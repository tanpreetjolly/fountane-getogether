import { CiEdit } from "react-icons/ci"
import { useAppSelector } from "@/hooks"
import { useNavigate } from "react-router-dom"
import ServiceNotificationCard from "@/components/ServiceNotificationCard"
import ButtonSecondary from "@/components/ButtonSecondary"

const VendorHome: React.FC<{}> = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const notifications = user?.notifications || []
  const serviceNotifications = notifications
    .map((notification) => {
      return {
        serviceList: notification.serviceList,
        eventId: notification._id,
        eventName: notification.name,
        host: notification.host,
      }
    })
    .flat()

  let count = 0
  serviceNotifications.map((notification) =>
    notification.serviceList.map((_service) => count++),
  )

  return (
    <div className="px-4 py-4 lg:w-5/6 mx-auto min-h-[80vh] bg-white rounded-2xl my-4">
      <div className="flex  flex-col md:flex-row justify-between md:items-center border-b ">
        <h2 className="pl-1 mb-2 md:mb-0 text-slate-800 text-xl md:text-2xl font-medium">
          My Vendor Profile
        </h2>
        <ButtonSecondary
          text="Change Service & Price"
          onClick={() => {
            navigate("edit-services")
          }}
          icon={<CiEdit className="text-2xl" />}
        />
      </div>
      <div className=" pl-1 mt-4   text-zinc-800">All Service Requests</div>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        {count === 0 && (
          <div className="text-center italic text-xl px-4 text-gray-500 h-[40vh] flex items-center justify-center">
            No Service Requests
          </div>
        )}
        {serviceNotifications.map((notification) =>
          notification.serviceList.map((service) => (
            <ServiceNotificationCard
              service={service}
              notification={notification}
              isVendor={true}
            />
          )),
        )}
      </div>
    </div>
  )
}

export default VendorHome
