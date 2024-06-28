import { useEffect, useState } from "react"
import { search } from "@/api"
import { ServiceSearchType } from "@/definitions"
import VendorCard from "@/components/VendorCard"
import { useEventContext } from "@/context/EventContext"
import { Skeleton } from "@/components/ui/skeleton"

const SearchVendors = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [vendors, setVendors] = useState<ServiceSearchType[]>([])
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const [loadingSearch, setLoadingSearch] = useState(true)

  const { event, loadingEvent } = useEventContext()

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSearch(true)
      search(searchQuery, "service", 1, 20)
        .then((response: { data: ServiceSearchType[] }) => {
          // console.log(response.data)
          setVendors(response.data)
        })
        .catch((error) => console.error(error.response))
        .finally(() => setLoadingSearch(false))
    }

    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(fetchData, 1500)
    setTimeoutId(id)
  }, [searchQuery])

  if (loadingEvent) return <div>Loading...</div>
  if (!event) return <div>No Event Found</div>

  const displayVendors = vendors

  return (
    <div className="px-4 lg:w-5/6 mx-auto p-4">
      <div className="bg-sky-100  p-5 rounded-2xl  mb-4">
        <div className=" text-gray-800 px-2 text-2xl">
          Search Vendors for <br />{" "}
          <span className="text-xl font-medium">{event.name}</span>
        </div>
        <div className="flex flex-col gap-2 py-2  mt-2 md:w-1/2">
          {/* Search input */}
          <input
            type="text"
            className="border border-gray-300 bg-white text-sm rounded-xl px-3 py-2 focus:outline-none"
            placeholder="Search vendors by services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {
        // Loading spinner
        loadingSearch ? (
          <div className="flex justify-center flex-col md:flex-row space-y-2">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ) : displayVendors.length === 0 ? (
          <div className="text-center text-gray-500">No Vendors Found</div>
        ) : (
          <div className="bg-white md:p-5 rounded-2xl grid md:grid-cols-2 xl:grid-cols-3 gap-2">
            {displayVendors.map((vendor) => (
              <VendorCard key={vendor._id} service={vendor} />
            ))}
          </div>
        )
      }
    </div>
  )
}

export default SearchVendors
