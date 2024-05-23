import { useEffect } from "react"
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./hooks"
import { loadUser } from "./features/userSlice"

//Components
import Navbar from "./components/Navbar"
import Loader from "./components/Loader"
import FeaturesPage from "./components/Features"
import CreateEvent from "./components/CreateEvent"

//Pages
import HomePage from "./Pages/HomePage"
import SignIn from "./Pages/SignInPage"
import SignUp from "./Pages/SignUpPage"
import VerifyOTP from "./Pages/VerifyOTP"
import ForgotPassword from "./Pages/ForgotPasswordPage"
import About from "./Pages/AboutPage"
import ErrorPage from "./Pages/ErrorPage"
import AllEvent from "./Pages/AllEvent"
import SearchResults from "./Pages/SearchResults"
import ProfilePage from "./Pages/ProfilePage"
import EventPage from "./Pages/EventPage"
import SubEventChannels from "./Pages/SubEventPage"
import ChannelChat from "./Pages/ChannelChat"
import ManageVendors from "./Pages/ManageVendors"
import VendorChat from "./Pages/VendorChat"
import SearchVendors from "./Pages/SearchVendors"
import AssignVendors from "./Pages/AssignVendors"
import InviteGuests from "./Pages/InviteGuests"
import ManageGuests from "./Pages/ManageGuests"
import CreateFestivityPage from "./Pages/CreateFestivityPage"
import BudgetsAndPayment from "./Pages/BudgetsAndPayment"
import VendorHome from "./Pages/VendorHome"
import VendorSubEvents from "./Pages/VendorSubEvents"
import VendorChannels from "./Pages/VendorChannels"
import EditVendorServices from "./Pages/EditVendorServices"

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
            path: "profile",
            element: <ProfilePage />,
          },
        ],
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
        element: <AllEvent />,
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
        path: "vendor-home/events/:id/festivities/:subEventId/channels/:channelId",
        element: <VendorChat />,
      },
      {
        path: "vendor-home/events/:id/festivities/:subEventId",
        element: <VendorChannels />,
      },
      {
        path: "events/:id/manage-vendors",
        element: <ManageVendors />,
      },
      {
        path: "events/:id/manage-guests",
        element: <ManageGuests />,
      },
      {
        path: "events/:id/festivities/:subEventId/assign-vendors",
        element: <AssignVendors />,
      },
      {
        path: "events/:id/festivities/:subEventId/invite-guests",
        element: <InviteGuests />,
      },

      {
        path: "search-vendors/:id",
        element: <SearchVendors />,
      },

      {
        path: "vendor-home/edit-services",
        element: <EditVendorServices />,
      },
      {
        path: "vendor-home",
        element: <VendorHome />,
      },
      {
        path: "vendor-chat/:id",
        element: <VendorChat />,
      },
      {
        path: "vendor-home/events/:id",
        element: <VendorSubEvents />,
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
        path: "events/:id/payments-budget",
        element: <BudgetsAndPayment />,
      },
      {
        path: "events/create",
        element: <CreateEvent />,
      },
      {
        path: "events/:id/create-festivity",
        element: <CreateFestivityPage />,
      },
      {
        path: "about",
        element: <About />,
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
