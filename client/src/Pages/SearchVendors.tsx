import  { useState } from "react"
import VendorCard from "../components/VendorCard"

type Props = {}

const vendorData = [
  {
    id: "11",
    name: "Shivam Caterers",
    type: "food",
    status: "invite",
    events : ["100", "200", "300", "400"]
  },
  {
    id: "21",
    name: "Vanish Caterings",
    type: "food",
    status: "invite",
    events : ["100", "200", "300", "400"]
  },
  {
    id: "31",
    name: "Event Managers Inc.",
    type: "event management",
    status: "invited",
    events : ["100", "200", "300", "400"]
  },
  {
    id: "41",
    name: "Dhillon Managers Inc.",
    type: "event management",
    status: "invited",
    events : ["100", "200", "300", "400"]
  },

]


const SearchVendors = (_props: Props) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (event:any) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div>
      <div className="px-4 divide-y space-y-2">
        <div className="pt-2">
          <div className="font-medium text-gray-800 px-2 text-xl">
            Search Vendors
          </div>
          <div className="flex flex-col gap-2 py-2">
            {/* Search input */}
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {vendorData
              .filter((vendor) =>
                vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchVendors