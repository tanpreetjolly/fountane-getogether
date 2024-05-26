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

//Context
import { EventContextProvider } from "./context/EventContext"

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
  return (
    <EventContextProvider>
      <Outlet />
    </EventContextProvider>
  )
}

const ProtectedRouteVendor = () => {
  const { loading, isAuthenticated, user } = useAppSelector(
    (state) => state.user,
  )

  if (loading) return <Loader />
  if (!isAuthenticated || !user) return <Navigate to="/sign-in" />
  if (user.isVendor === false) return <Navigate to="/events" />
  return (
    <EventContextProvider>
      <Outlet />
    </EventContextProvider>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "features", element: <FeaturesPage /> },
      { path: "search", element: <SearchResults /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify", element: <VerifyOTP /> },
      { path: "about", element: <About /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "events", element: <AllEvent /> },
          { path: "events/create", element: <CreateEvent /> },
          {
            path: "events/:eventId",
            children: [
              { index: true, element: <EventPage /> },
              { path: "manage-vendors", element: <ManageVendors /> },
              { path: "manage-guests", element: <ManageGuests /> },
              { path: "payments-budget", element: <BudgetsAndPayment /> },
              { path: "create-festivity", element: <CreateFestivityPage /> },
              {
                path: "festivities/:subEventId",
                children: [
                  { index: true, element: <SubEventChannels /> },
                  { path: "assign-vendors", element: <AssignVendors /> },
                  { path: "invite-guests", element: <InviteGuests /> },
                  { path: "channels/:channelId", element: <ChannelChat /> },
                ],
              },
            ],
          },
          { path: "search-vendors/:id", element: <SearchVendors /> },
          { path: "vendor-chat/:id", element: <VendorChat /> },
        ],
      },
      {
        path: "vendor-home",
        element: <ProtectedRouteVendor />,
        children: [
          { index: true, element: <VendorHome /> },
          { path: "edit-services", element: <EditVendorServices /> },
          { path: "events/:id", element: <VendorSubEvents /> },
          {
            path: "events/:id/festivities/:subEventId",
            element: <VendorChannels />,
          },
          {
            path: "events/:id/festivities/:subEventId/channels/:channelId",
            element: <VendorChat />,
          },
        ],
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
