import axios from "axios"
import toast from "react-hot-toast"
import {
  LoginType,
  SignUpType,
  UserType,
  ForgotPasswordType,
  EventShortType,
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
