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
  serviceName: string
  serviceDescription: string
  price: number
}

export interface VendorProfileType {
  userId: string
  services: ServiceType[]
}

export interface HostType {
  _id: string
  name: string
  profileImage: string
}

export interface EventShortType {
  _id: string
  name: string
  startDate: string
  endDate: string
  host: HostType
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

export interface UserListType {
  _id: string
  user: OtherUserType
  role: string
  permission: [string]
}

export interface EventFull extends EventShortType {
  budget: number
  venue: string
  subEvents: SubEventType[]
  userList: UserListType[]
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
