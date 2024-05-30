import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import SearchBar from "./SearchBar"
import { useEffect, useRef, useState } from "react"
import { logout } from "../features/userSlice"
import confirm from "./ConfirmationComponent"

const HomeNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { loading, isAuthenticated } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const dropdownRef = useRef<any>(null)
  const iconRef = useRef<any>(null)

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !iconRef.current?.contains(event.target)
    ) {
      setIsOpen(false)
    }
  }
  const handleLogout = async () => {
    const confirmLogout = await confirm(
      "Are you sure you want to logout? This will clear all saved blog data.",
      {
        title: "Logout",
        deleteButton: "Logout",
        cancelButton: "Cancel",
      },
    )
    if (confirmLogout === false) return
    dispatch(logout())
    setIsOpen(false)
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <div>
      <nav className="bg-white fixed w-4/5  mx-auto z-20 top-0 left-1/2 -translate-x-[50%] border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-3 py-4">
          <NavLink
            to={`${!loading && isAuthenticated ? "/events" : "/"}`}
            className="flex items-center w-fit"
          >
            <img src="https://i.imgur.com/na478rM.png" alt="logo" className="w-60"/>
          </NavLink>
          

          {!loading && !isAuthenticated ? (
            <div className="flex md:order-2 space-x-3 md:space-x-0">
              <NavLink
                to="/sign-in"
                className="text-white bg-slate-800  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full  px-5 py-2.5 text-center "
              >
                <span>Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </NavLink>
            </div>
          ) : (
            <NavLink
              to="/events"
              className="text-white bg-slate-800 text-sm focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full  px-5 py-2.5 text-center "
            >
              <span>My Events</span>
             
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  )
}
export default HomeNav
