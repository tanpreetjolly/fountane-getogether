import { useAppSelector } from "@/hooks"
import { useNavigate } from "react-router-dom"

const MyChats = () => {
  const navigate = useNavigate()

  const { user, loading } = useAppSelector((state) => state.user)
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  const vendorChats = user.myChats

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl pl-2 my-2 font-semibold">My Chats</h2>
      <div className="grid gap-6 max-w-2xl">
        {vendorChats?.map((vendor: any) => (
          <div
            key={vendor.id}
            className="flex items-center gap-4 p-4 rounded-md shadow"
            onClick={() => navigate(`/my-chats/${vendor._id}`)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyChats
