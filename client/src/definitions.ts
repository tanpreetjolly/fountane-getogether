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

export interface ServiceType {
  _id: string
  serviceName: string
  serviceDescription: string
  price: number
}

export interface VendorProfileType {
  user: OtherUserType
  services: ServiceType[]
}

export interface EventShortType {
  _id: string
  name: string
  startDate: string
  endDate: string
  host: OtherUserType
  eventType: string
  budget: number
  createdAt: string
  updatedAt: string
}

export interface OtherUserType {
  _id: string
  name: string
  email: string
  profileImage: string
  phoneNo: string
}

export interface ChannelType {
  _id: string
  name: string
  allowedUsers: OtherUserType[]
}

export interface SubEventType {
  _id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  channels: ChannelType[]
  updatedAt: string
  createdAt: string
}

export interface SubEventsVendorType {
  _id: string
  subEvent: Omit<SubEventType, "channels">
  status: string
  servicesOffering: [string]
  paymentStatus: string
  amount: number
}

export interface UserListType {
  _id: string
  user: OtherUserType
  // role: string
  // permission: [string]
  subEvents: [string]
  createdAt: string
  status: string
}

export interface VendorListType {
  _id: string
  vendor: VendorProfileType
  // permission: [string]
  subEvents: SubEventsVendorType[]
  createdAt: string
}

export interface EventFull extends EventShortType {
  budget: number
  venue: string
  subEvents: SubEventType[]
  userList: UserListType[]
  vendorList: VendorListType[]
}

export interface VendorSearchType {
  _id: string
  user: OtherUserType
  services: ServiceType[]
}

export interface UserType {
  userId: string
  name: string
  email: string
  profileImage?: string
  isVendor: boolean
  vendorProfile?: VendorProfileType
  phoneNo: string | undefined
  socketToken: string
  events: EventShortType[]
  createdAt: string
  updatedAt: string
}
