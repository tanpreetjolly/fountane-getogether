import { useEffect } from "react"
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom"

//Components
import Navbar from "./components/Navbar"
// import Footer from "./components/Footer"

//Pages
import HomePage from "./Pages/HomePage"
import SignIn from "./Pages/SignInPage"
import SignUp from "./Pages/SignUpPage"
import VerifyOTP from "./Pages/VerifyOTP"
import ForgotPassword from "./Pages/ForgotPasswordPage"
import DashBoard from "./Pages/DashBoardPage"
import BlogEditor from "./Pages/BlogEditorPage"
import About from "./Pages/AboutPage"
import ErrorPage from "./Pages/ErrorPage"
import { useAppDispatch, useAppSelector } from "./hooks"
import { loadUser } from "./features/userSlice"
import AllBlogs from "./Pages/AllBlogs"
import Loader from "./components/Loader"
import SearchResults from "./Pages/SearchResults"
import PublicProfilePage from "./Pages/PublicProfile"
import ProfilePage from "./Pages/ProfilePage"
import FeaturesPage from "./components/Features"
import CreateEvent from "./components/CreateEvent"
import EventPage from "./Pages/BlogPage"
import SubEventChannels from "./Pages/SubEventChannels"
import ChannelChat from "./Pages/ChannelChat"
import AssignVendors from "./Pages/AssignVendors"
import VendorChat from "./Pages/VendorChat"
import SearchVendors from "./Pages/SearchVendors"

const Layout = () => {
  const location = useLocation()
  const hideNavbarRoutes = [
    "/sign-in",
    "/sign-up",
    "/verify",
    "/forgot-password",
  ]
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname)
  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <ScrollRestoration />
      <div className={`min-h-screen ${!shouldHideNavbar && "pt-20"}`}>
        <Outlet />
      </div>
    </div>
  )
}
const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAppSelector((state) => state.user)

  if (loading) return <Loader />
  if (!isAuthenticated) return <Navigate to="/sign-in" />
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: "embed/blog/:id",
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashBoard />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "write/:id",
        element: <BlogEditor />,
      },
      {
        path: "features",
        element: <FeaturesPage />,
      },
      { path: "search", element: <SearchResults /> },
      { path: "sign-in", element: <SignIn /> },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify",
        element: <VerifyOTP />,
      },
      {
        path: "feed",
        element: <AllBlogs />,
      },

      {
        path: "events/:id",
        element: <EventPage />,
      },
      {
        path: "events/:id/festivities/:subEventId",
        element: <SubEventChannels />,
      },
      {
        path: "events/:id/manage-vendors",
        element: <AssignVendors />,
      },
      {
        path: "assign-vendors/:id",
        element: <AssignVendors />,
      },
        {
          path: "assign-vendors/:id",
          element: <AssignVendors />,
        },
      {
        path: "search-vendors/:id",
        element: <SearchVendors />,
      },
      {
        path: "vendor-chat/:id",
        element: <VendorChat />,
      },
      {
        path: "events/:id/festivities/:subEventId/channels/:channelId",
        element: <ChannelChat />,
      },
      {
        path: "events/:id",
        element: <EventPage />,
      },
      {
        path: "events/create",
        element: <CreateEvent />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "user/:id",
        element: <PublicProfilePage />,
      },
      {
        path: "/*",
        element: <ErrorPage />,
      },
    ],
  },
])

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadUser())
  }, [])
  return <RouterProvider router={router} />
}

export default App
