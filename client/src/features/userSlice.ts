import { createSlice, Dispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import toast from "react-hot-toast"
import {
  EventShortType,
  ForgotPasswordType,
  LoginType,
  SignUpType,
  UserType,
} from "../definitions"
import {
  signIn,
  signUp,
  signInGoogle,
  signInToken,
  signOut,
  verifyOtp,
  forgotPasswordSendOtpApi,
  forgotPasswordVerifyOtpApi,
  acceptRejectInviteGuest as acceptRejectInviteGuestAPI,
  acceptRejectInviteVendor as acceptRejectInviteVendorAPI,
  newOfferVendor,
} from "../api/index.ts"

interface CounterState {
  loading: boolean
  isAuthenticated: boolean
  user: UserType | null
  unReadChatsId: string[]
  verificationRequired: boolean
  verificationUserID: UserType["userId"] | string
}

const initialState: CounterState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  unReadChatsId: [],
  verificationRequired: false,
  verificationUserID: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      // console.log(action.payload)
      state.isAuthenticated = true
      state.verificationRequired = false
      state.verificationUserID = ""
      state.user = { ...state.user, ...action.payload }
    },
    SET_LOADING: (state) => {
      state.loading = true
    },
    //set loading false
    SET_LOADING_FALSE: (state) => {
      state.loading = false
    },
    LOGOUT_USER: (state) => {
      console.log("logout")
      state.isAuthenticated = false
      state.user = null
      verificationRequired: false
      verificationUserID: ""
    },
    UPDATE_NAME: (state, action) => {
      if (state.user) state.user.name = action.payload
    },
    SET_VERIFICATION_REQUIRED: (state, action) => {
      state.verificationUserID = action.payload
      state.verificationRequired = true
    },
    CREATE_EVENT: (state, action) => {
      state.user?.events.push(action.payload)
    },
    DELETE_EVENT: (state, action) => {
      if (state.user) {
        state.user.events = state.user.events.filter(
          (event) => event._id !== action.payload,
        )
      }
    },
    SET_CHAT_AS_UNREAD: (state, action) => {
      state.unReadChatsId.includes(action.payload)
        ? null
        : state.unReadChatsId.push(action.payload)
    },
    UPDATE_EVENT: (state, action) => {
      if (state.user) {
        console.log(action.payload)

        state.user.events = state.user.events.map((event) =>
          event._id === action.payload._id ? action.payload : event,
        )
      }
    },
  },
})

export const logout = () => async (dispatch: Dispatch) => {
  toast.loading("Logging out", { id: "logout" })
  dispatch(userSlice.actions.SET_LOADING())
  signOut()
    .then((_res) => {
      // console.log(_res)
      dispatch(userSlice.actions.LOGOUT_USER())
      toast.success("Logged out")
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      dispatch(userSlice.actions.SET_LOADING_FALSE())
      toast.dismiss("logout")
    })
}
export const login = (loginValues: LoginType) => async (dispatch: any) => {
  if (!loginValues.email || !loginValues.password)
    return toast.error("Email and Password are required")

  dispatch(userSlice.actions.SET_LOADING())
  signIn(loginValues)
    .then((_res: any) => {
      // console.log(_res)
      dispatch(loadUser())
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      dispatch(userSlice.actions.SET_LOADING_FALSE())
    })
}

export const register =
  (signupValues: SignUpType) => async (dispatch: Dispatch) => {
    toast.loading("Registering", { id: "register" })
    dispatch(userSlice.actions.SET_LOADING())

    signUp(signupValues)
      .then((_res) => {
        // console.log(_res)

        const id = _res.data.userId
        const data = dispatch(userSlice.actions.SET_VERIFICATION_REQUIRED(id))
        console.log(data)
        toast.success("Email Sent", { id: "register" })
      })
      .catch((err) => {
        console.log(err)
        toast.dismiss("register")
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE())
      })
  }

export const loginGoogle = (token: string) => async (dispatch: any) => {
  dispatch(userSlice.actions.SET_LOADING())
  signInGoogle(token)
    .then((_res) => dispatch(loadUser()))
    .catch((err) => console.log(err))
    .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
}

export const forgotPasswordSendOtp =
  (forgotPasswordValues: ForgotPasswordType, setPage: any) =>
  async (dispatch: any) => {
    toast.loading("Sending OTP", { id: "forgotPassword" })
    dispatch(userSlice.actions.SET_LOADING())
    const { email } = forgotPasswordValues
    forgotPasswordSendOtpApi(email)
      .then((_res) => {
        console.log(_res)
        toast.success("OTP Sent", { id: "forgotPassword" })
        setPage(1)
      })
      .catch((err) => {
        console.log(err)
        toast.dismiss("forgotPassword")
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE())
      })
  }

export const forgotPasswordVerifyOtp =
  (forgotPasswordValues: ForgotPasswordType) => async (dispatch: any) => {
    toast.loading("Verifying OTP", { id: "forgotPassword" })
    dispatch(userSlice.actions.SET_LOADING())
    forgotPasswordVerifyOtpApi(forgotPasswordValues)
      .then((_res: any) => {
        // console.log(_res)
        toast.success("Password changed successfully", { id: "forgotPassword" })
        dispatch(loadUser())
      })
      .catch((err) => {
        console.log(err)
        toast.dismiss("forgotPassword")
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE())
      })
  }

export const verification =
  (otp: string) => async (dispatch: any, getState: any) => {
    const verificationRequired = getState().user.verificationRequired
    if (!verificationRequired) return toast.error("Something went wrong.")

    const userId = getState().user.verificationUserID
    if (!userId) return toast.error("User Not Found")

    toast.loading("Verifying", { id: "verification" })
    dispatch(userSlice.actions.SET_LOADING())
    verifyOtp({ userId, otp })
      .then((_res: any) => {
        // console.log(_res)

        dispatch(loadUser())
        toast.success("Registered Successfully", { id: "verification" })
      })
      .catch((err) => {
        console.log(err)
        toast.dismiss("verification")
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE())
      })
  }

export const loadUser =
  (showToast: boolean = true) =>
  async (dispatch: Dispatch) => {
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
      const [key, _value] = cookie.split("=")
      if (key.trim() === "userId") return true
      return false
    })
    if (!isLoggedIn) return dispatch(userSlice.actions.SET_LOADING_FALSE())

    dispatch(userSlice.actions.SET_LOADING())
    signInToken()
      .then((res: any) => {
        const user = res.data

        if (showToast) toast.success("Logged in", { id: "loadUser" })
        dispatch(userSlice.actions.SET_USER(user))
      })
      .catch((error) => console.log(error))
      .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
  }

export const updateUser = (user: UserType) => async (dispatch: Dispatch) => {
  dispatch(userSlice.actions.SET_USER(user))
}
export const createEventSlice =
  (event: EventShortType) => async (dispatch: Dispatch) => {
    dispatch(userSlice.actions.CREATE_EVENT(event))
  }

export const deleteEventSlice =
  (eventId: string) => async (dispatch: Dispatch) => {
    dispatch(userSlice.actions.DELETE_EVENT(eventId))
  }

export const updateEventSlice =
  (event: EventShortType) => async (dispatch: Dispatch) => {
    dispatch(userSlice.actions.UPDATE_EVENT(event))
  }

export const acceptRejectNotificationGuest =
  (
    eventId: string,
    eventUpdate: {
      status: string
      eventId: string
      userListId: string
      expectedGuest: number
    },
  ) =>
  async (dispatch: any) => {
    toast.promise(
      acceptRejectInviteGuestAPI(eventId, eventUpdate),
      {
        loading: "Processing",
        success: () => {
          dispatch(loadUser(false))
          return "Success"
        },
        error: (err) => {
          console.log(err)
          toast.dismiss(err.response.data.msg)
          return err.response.data.msg
        },
      },
      {
        id: "acceptRejectNotification",
      },
    )
  }
export const newOfferNotificationVendor =
  (
    eventId: string,
    eventUpdate: {
      serviceListId: string
      newOfferPrice: number
      offerBy: string
    },
  ) =>
  async (dispatch: any) => {
    toast.promise(
      newOfferVendor(eventId, eventUpdate),
      {
        loading: "Processing",
        success: () => {
          dispatch(loadUser(false))
          return "Success"
        },
        error: (err) => {
          console.log(err)
          toast.dismiss(err.response.data.msg)
          return err.response.data.msg
        },
      },
      {
        id: "acceptRejectNotification",
      },
    )
  }
export const acceptRejectNotificationVendor =
  (
    eventId: string,
    eventUpdate: {
      status: string
      serviceListId: string
      offerBy: string
    },
  ) =>
  async (dispatch: any) => {
    toast.promise(
      acceptRejectInviteVendorAPI(eventId, eventUpdate),
      {
        loading: "Processing",
        success: () => {
          dispatch(loadUser(false))
          return "Success"
        },
        error: (err) => {
          console.log(err)
          toast.dismiss(err.response.data.msg)
          return err.response.data.msg
        },
      },
      {
        id: "acceptRejectNotification",
      },
    )
  }

export const setChatAsUnread = (chatId: string) => async (dispatch: any) => {
  dispatch(userSlice.actions.SET_CHAT_AS_UNREAD(chatId))
}
export const selectUserState = (state: RootState) => state.user

export default userSlice.reducer
