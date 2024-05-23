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

export interface Service {
  serviceName: string
  serviceDescription: string
  price: number
}

export interface VendorProfile{
  userId:string
  services:Service[]
}

export interface UserType {
  userId: string
  name: string
  email: string
  profileImage?: string
  isVendor: boolean
  vendorProfile?: VendorProfile
  phoneNo: string | undefined
  socketToken: string
  createdAt: string
  updatedAt: string
}