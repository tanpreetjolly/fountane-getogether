export interface LoginType {
  email: string
  password: string
}

export interface SignUpType {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNo: string | undefined
  isVendor: boolean
}

export interface ForgotPasswordType {
  email: string
  otp: string
  password: string
}

interface User {
  name: string
  email: string
  profileImage?: string
  isVendor?: boolean
  vendorProfile?: any
  phoneNo: string | undefined
  socketToken: string
}

export interface UserType extends User {
  userId: string
  createdAt: string
  updatedAt: string
}

export type Profile = {
  _id: string
  name: string
  createdAt: string
}

export type Comment = {
  _id: string
  message: string
  author: {
    _id: string
    name: string
    profileImage: string
  }
}
