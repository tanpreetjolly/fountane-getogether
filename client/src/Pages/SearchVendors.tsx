import { useEffect, useState } from "react"
import { search } from "@/api"
import { VendorSearchType } from "@/definitions"
import VendorCard from "@/components/VendorCard"

const SearchVendors = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [vendors, setVendors] = useState<VendorSearchType[]>([])
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value)
  }
  useEffect(() => {
    const fetchData = async () => {
      search(searchQuery, "vendor", 1, 20)
        .then((response: { data: { vendors: VendorSearchType[] } }) => {
          console.log(response.data)

          setVendors(response.data.vendors)
        })
        .catch((error) => console.error(error.response))
    }

    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(fetchData, 500)
    setTimeoutId(id)
  }, [searchQuery])

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
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.user._id}
              vendor={{
                vendor: vendor.user,
                services: vendor.services,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchVendors
