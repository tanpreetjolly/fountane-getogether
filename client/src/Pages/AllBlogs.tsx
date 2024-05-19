import Blogs from "../components/Blogs"
import Categories from "../components/Categories"
import { useEffect, useState } from "react"
import { TrendingType } from "../definitions"
import { getTrendingBlog } from "../api"
import { Link } from "react-router-dom"
import Loader from "../components/Loader"
import TrendingSvg from "../assets/img/Feed/TrendingSvg"
import AuthorTag from "../components/AuthorTag"

const AllBlogs = () => {
  const [trending, setTrending] = useState<TrendingType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // useEffect(() => {
  //   setLoading(true)
  //   getTrendingBlog()
  //     .then((res) => setTrending(res.data.blogs))
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false))
  // }, [])

  return (
    <div>
     
    </div>
  )
}

export default AllBlogs
