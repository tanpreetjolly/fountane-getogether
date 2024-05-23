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

export interface VendorProfile {
  userId: string
  services: Service[]
}

export interface Host {
  _id: string
  name: string
  profileImage: string
}

export interface EventShort {
  _id: string
  name: string
  startDate: string
  endDate: string
  host: Host
  createdAt: string
  updatedAt: string
}

export interface EventFull extends EventShort {
  venue: string
  // subEvents: SubEvent[]
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
  events: EventShort[]
  createdAt: string
  updatedAt: string
}
