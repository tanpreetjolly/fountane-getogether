import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
// add icon from react-icons
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
const AllBlogs = () => {
  const navigate = useNavigate()
  // useEffect(() => {
  //   setLoading(true)
  //   getTrendingBlog()
  //     .then((res) => setTrending(res.data.blogs))
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false))
  // }, [])

  return (
    <div className="px-4 mx-auto">
      <Button
        text="Create an Event"
        icon={<FaPlus />}
        onClick={() => navigate("/events/create")}
      />
      <div>
        <EventCard />
      </div>
    </div>
  )
}

export default AllBlogs
