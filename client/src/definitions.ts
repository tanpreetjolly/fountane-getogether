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

export interface BlogShortType {
  _id: string
  title: string
  description: string
  img: string
}

export interface BlogCreateType {
  _id: string
  title: string
  description: string
  img: string
  content: {
    time: number
    blocks: { type: string; data: any }[]
    version: string
  }
}

export interface BlogCardType extends BlogShortType {
  likesCount: number
  commentsCount: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface BlogFullType extends BlogShortType {
  likesCount: number
  commentsCount: number
  views: number
  createdAt: string
  updatedAt: string
  content: string
}

interface User {
  name: string
  email: string
  // bio?: string
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
  blogs?: BlogFullType[]
}

export type ProfileBlogs = {
  _id: string
  title: string
  author: string
  img: string
  tags: string[]
  likesCount: number
  commentsCount: number
  views: number
  createdAt: string
  description: string
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
