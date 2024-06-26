import { useAppSelector } from "@/hooks"
import { useNavigate } from "react-router-dom"

const MyChats = () => {
  const navigate = useNavigate()

  const { user, loading } = useAppSelector((state) => state.user)
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  const vendorChats = user.myChats

  return (
    <div className="lg:w-4/5 mx-auto p-5 my-2 bg-white rounded-2xl">
      <h2 className="text-2xl mb-4 font-medium">My Conversations</h2>
      <div className="grid gap-6 ">
        {vendorChats?.map((vendor: any) => (
          <div
            key={vendor.id}
            className="flex items-center gap-4 p-4 rounded-xl border shadow-sm cursor-pointer"
            onClick={() => navigate(`/my-chats/${vendor._id}`)}
          >
            <div className="aspect-square h-10 flex justify-center items-center bg-slate-200 rounded-full">
              {vendor.name.slice(0, 1)}
            </div>

            <div className="flex justify-between w-full">
              <div>
                <p className="text-lg font-medium text-gray-600">
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
