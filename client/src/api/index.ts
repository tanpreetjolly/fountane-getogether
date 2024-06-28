import axios from "axios"
import toast from "react-hot-toast"
import {
  LoginType,
  SignUpType,
  UserType,
  ForgotPasswordType,
  EventShortType,
  ServiceType,
} from "../definitions"
/*
 ********************** Configuring Axios **********************
 */

const URL = "/api/v1"

const API = axios.create({ baseURL: URL, withCredentials: true })
const publicRoutes = ["auth", "public"]

API.interceptors.request.use(function (config) {
  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route),
  )

  if (!isPublicRoute) {
    //if there is cookie with named 'userId' then user is logged in
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
      const [key, _value] = cookie.split("=")
      if (key.trim() === "userId") return true
      return false
    })
    if (!isLoggedIn) return Promise.reject(new axios.Cancel("Not Logged In"))
  }

  return config
})

API.interceptors.response.use(
  function (response) {
    const isAIImage = response.headers["x-ai-generated-image"] === "true"
    if (isAIImage) return response

    if (!response.data.success) {
      toast.error(response.data.msg, { id: response.data.msg })
      return Promise.reject(response.data)
    }
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (import.meta.env.DEV) console.log(error)

    if (error.response) {
      toast.error(error.response.data?.msg, { id: error.response.data?.msg })
    } else {
      if (error.message === "Not Logged In") {
        toast.error("Please Login to use this feature.", {
          id: "Not Logged In",
        })
      } else {
        toast.error("Network Error: Please try again later.", {
          id: "Network Error",
        })
      }
    }
    return Promise.reject(error)
  },
)

interface VerifyOtpParams {
  userId: UserType["userId"]
  otp: string
}

/*
 ********************** Sign In and Sign Up **********************
 */
export const signIn = (login: LoginType) => API.post("/auth/sign-in", login)
export const signUp = (signup: SignUpType) => API.post("/auth/sign-up", signup)
export const signInGoogle = (tokenId: string) =>
  API.post("/auth/sign-in/google", { tokenId })
export const forgotPasswordSendOtpApi = (email: string) =>
  API.post("/auth/forgot-password/send-otp", { email })
export const forgotPasswordVerifyOtpApi = (
  forgotPasswordValues: ForgotPasswordType,
) => API.post("/auth/forgot-password/verify-otp", forgotPasswordValues)
export const verifyOtp = (verifyOtpParams: VerifyOtpParams) =>
  API.post("/auth/verify", verifyOtpParams)
export const signInToken = () => API.get("/user/me")
export const signOut = () => API.post("/auth/sign-out")
export const getOtherUserDetails = (otherUserId: string) =>
  API.get(`/public/user/${otherUserId}`)

/*
 ********************** User Requests **********************
 */

export const updateProfile = (userData: UserType) => {
  const { name } = userData
  return API.patch("/user/update-profile", {
    name,
  })
}

export const updateImage = (profileImage: File) => {
  const formData = new FormData()
  formData.append("profileImage", profileImage)
  return API.post("/user/image", formData)
}
export const deleteProfileImage = () => API.delete("/user/image")
/*
 ************************ Search Requests ************************
 */
export const search = (
  query: string,
  type: string,
  page: number,
  limit: number,
) =>
  API.get("/public/search", {
    params: {
      query,
      type,
      page,
      limit,
    },
  })

/*
 ************************ Event Host Requests ************************
 */

export const getEvent = (eventId: string) => API.get(`/event/${eventId}`)

export const getChatMessages = (chatId: string) =>
  API.get(`/user/chats/${chatId}/messages`)

export const getChannelMessages = (channelId: string) =>
  API.get(`/user/channels/${channelId}/messages`)

export const createEvent = (eventData: {
  name: string
  startDate: string
  endDate: string
  budget: string
  eventType: string
}) => API.post("/event", eventData)
export const updateEvent = (eventData: EventShortType) =>
  API.patch(`/event/${eventData._id}`, eventData)

export const deleteEvent = (eventId: string) => API.delete(`/event/${eventId}`)

export const createSubEvent = (
  eventId: string,
  subEventData: {
    name: string
    startDate: string
    endDate: string
    venue: string
  },
) => API.post(`/event/${eventId}/subEvent`, subEventData)

export const createSubEventChannel = (
  eventId: string,
  subEventId: string,
  channelData: { name: string; allowedUsers: string[] },
) => API.post(`/event/${eventId}/subEvent/${subEventId}/channel`, channelData)

export const inviteGuest = (
  eventId: string,
  guestData: { guestId: string; subEventsIds: string[] },
) => API.post(`/event/${eventId}/guest/invite`, guestData)

export const inviteNewGuest = (
  eventId: string,
  guestData: {
    name: string
    phoneNo: string
    email: string
    subEventsIds: string[]
  },
) => API.post(`/event/${eventId}/guest/invite/new`, guestData)

export const acceptRejectInviteGuest = (
  eventId: string,
  eventUpdate: {
    status: string
    eventId: string
    userListId: string
    expectedGuest: number
  },
) => API.post(`/event/${eventId}/guest/invite/accept-reject`, eventUpdate)

export const acceptRejectInviteVendor = (
  eventId: string,
  eventUpdate: {
    status: string
    serviceListId: string
    offerBy: string
  },
) => API.post(`/event/${eventId}/vendor/invite/accept-reject`, eventUpdate)

export const newOfferVendor = (
  eventId: string,
  eventUpdate: {
    serviceListId: string
    newOfferPrice: number
    offerBy: string
  },
) => API.post(`/event/${eventId}/vendor/new-offer`, eventUpdate)

export const makeAOffer = (
  eventId: string,
  offerData: {
    vendorProfileId: string
    subEventIds: string[]
    serviceId: string
    selectedItemIds: string[]
    estimatedGuestNos: string[]
    offerPrices: string[]
  },
) => API.post(`/event/${eventId}/vendor/offer`, offerData)

export const addRemoveGuestsToSubEvent = (
  eventId: string,
  subEventId: string,
  guestData: { guestIds: string[] },
) =>
  API.post(
    `/event/${eventId}/subEvent/${subEventId}/guest/invite/add-remove`,
    guestData,
  )

export const updateEventBudget = (eventId: string, budget: number) =>
  API.patch(`/event/${eventId}/budget`, { budget })

export const updatePaymentStatus = (
  eventId: string,
  serviceListId: string,
  status: string,
) =>
  API.put(`/event/${eventId}/service/${serviceListId}/payment-status`, {
    status,
  })

export const createService = (
  vendorId: string,
  serviceData: Omit<ServiceType, "_id" | "items"> & {
    items: Omit<ServiceType["items"][0], "_id">[]
  },
) => API.post(`/vendor/${vendorId}/service`, serviceData)

export const updateService = (
  vendorId: string,
  serviceId: string,
  serviceData: ServiceType,
) => API.put(`/vendor/${vendorId}/service/${serviceId}`, serviceData)

export const addTask = (
  eventId: string,
  taskData: { name: string; completed: boolean },
) => API.post(`/event/${eventId}/task`, taskData)

export const updateTask = (
  eventId: string,
  taskId: string,
  taskData: { name: string; completed: boolean },
) => API.put(`/event/${eventId}/task/${taskId}`, taskData)

export const deleteTask = (eventId: string, taskId: string) =>
  API.delete(`/event/${eventId}/task/${taskId}`)

export const uploadImage = (image: File) => {
  const formData = new FormData()
  formData.append("image", image)
  return API.post("/user/upload/image", formData)
}

export const getInvitationDetails = (token: string) =>
  API.post(`/public/invite/guest/details`, { token })

export const acceptRejectInviteGuestPublic = (
  token: string,
  status: string,
  expectedGuest: number,
) =>
  API.post(`/public/invite/guest/accept-reject`, {
    token,
    status,
    expectedGuest,
  })
