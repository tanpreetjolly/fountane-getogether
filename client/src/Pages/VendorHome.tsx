import ButtonCustom from "../components/Button"
import { CiEdit } from "react-icons/ci"
import { useAppSelector } from "@/hooks"
import { useNavigate } from "react-router-dom"
import ServiceNotificationCard from "@/components/ServiceNotificationCard"

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
    <div className="px-4 pt-2">
      <ButtonCustom
        text="Change Service & Price"
        onClick={() => {
          navigate("edit-services")
        }}
        icon={<CiEdit className="text-2xl" />}
      />
      <div className="text-xl pl-1 mt-4 mb-2 font-semibold text-zinc-800">
        Service Requests By User
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {count === 0 && (
          <div className="text-center italic text-xl px-4  text-gray-500 h-[40vh] flex items-center justify-center">
            No Service Requests
          </div>
        )}
        {serviceNotifications.map((notification) =>
          notification.serviceList.map((service) => {
            if (service.offerBy === "vendor") return null
            return (
              <ServiceNotificationCard
                service={service}
                notification={notification}
                isVendor={true}
              />
            )
          }),
        )}
      </div>
      <div className="text-xl pl-1 mt-4 mb-2 font-semibold text-zinc-800">
        Ongoing Requests
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {count === 0 && (
          <div className="text-center italic text-xl px-4  text-gray-500 h-[40vh] flex items-center justify-center">
            No Service Requests
          </div>
        )}
        {serviceNotifications.map((notification) =>
          notification.serviceList.map((service) => {
            if (service.offerBy === "user") return null
            return (
              <ServiceNotificationCard
                service={service}
                notification={notification}
                isVendor={true}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

export default VendorHome
