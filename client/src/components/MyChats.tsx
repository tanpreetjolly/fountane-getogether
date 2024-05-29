import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const vendorData = [
  {
    id: "1",
    name: "Alice Johnson",
    type: "Vendor",
    isOnline: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    type: "Vendor",
    isOnline: false,
  },
  {
    id: "3",
    name: "Charlie Brown",
    type: "Vendor",
    isOnline: true,
  },
  {
    id: "4",
    name: "Daisy Ridley",
    type: "Vendor",
    isOnline: false,
  },
  {
    id: "5",
    name: "Ethan Hunt",
    type: "Vendor",
    isOnline: true,
  },
  {
    id: "6",
    name: "Fiona Apple",
    type: "Vendor",
    isOnline: false,
  },
  {
    id: "7",
    name: "George Clooney",
    type: "Vendor",
    isOnline: true,
  },
  {
    id: "8",
    name: "Hannah Montana",
    type: "Florist",
    isOnline: false,
  },
  {
    id: "9",
    name: "Isaac Newton",
    type: "Event Planner",
    isOnline: true,
  },
  {
    id: "10",
    name: "Jane Doe",
    type: "Vendor",
    isOnline: false,
  },
]

const MyChats = () => {
  const [vendorChats, setVendorChats] = useState<any>([])
  console.log(vendorChats)
  const navigate = useNavigate()
  useEffect(() => {
    setVendorChats(vendorData)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl pl-2 my-2 font-semibold">My Chats</h2>
      <div className="grid gap-6 max-w-2xl">
        {vendorChats?.map((vendor: any) => (
          <div
            key={vendor.id}
            className="flex items-center gap-4 p-4 rounded-md shadow"
            onClick={() => navigate(`/my-chats/${vendor.id}`)}
          >
            <div className="aspect-square h-10 flex justify-center items-center bg-slate-200 rounded-full">
              {vendor.name.slice(0, 1)}
            </div>

            <div className="flex justify-between w-full">
              <div>
                <p className="text-lg font-semibold text-gray-600">
                  {vendor.name}
                </p>
                <p className="text-sm text-muted-foreground">{vendor.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm px-2 py-1 rounded-full ${vendor.isOnline ? "bg-green-300" : "bg-slate-200"}`}
                >
                  {vendor.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyChats
