import Blogs from "../components/Blogs"
import Categories from "../components/Categories"
import { useEffect, useState } from "react"
import { TrendingType } from "../definitions"
import { getTrendingBlog } from "../api"
import { Link, useNavigate } from "react-router-dom"
import Loader from "../components/Loader"
import TrendingSvg from "../assets/img/Feed/TrendingSvg"
import AuthorTag from "../components/AuthorTag"
import Button from "../components/Button"
// add icon from react-icons
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
const AllBlogs = () => {
  const [trending, setTrending] = useState<TrendingType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
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
      <Button text="Create an Event" icon={<FaPlus/>} onClick={()=>navigate("/events/create")}/>
      <div>
        <EventCard />
      </div>
    </div>
  )
}

export default AllBlogs
