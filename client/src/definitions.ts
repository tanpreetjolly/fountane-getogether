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

export interface ItemType {
  _id: string
  name: string
  description: string
  price: number
}

export interface ServiceType {
  _id: string
  serviceName: string
  serviceDescription: string
  serviceImage: string
  items: ItemType[]
}

export interface VendorProfileType {
  //this is vendorProfileId
  _id: string
  user: OtherUserType
  services: ServiceType[]
  createdAt: string
}

export interface EventShortType {
  _id: string
  name: string
  host: OtherUserType
  startDate: string
  endDate: string
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
  type: string
  allowedUsers: string[]
}

export interface SubEventType {
  _id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  channels: ChannelType[]
  createdAt: string
}

export interface UserListType {
  _id: string
  user: OtherUserType
  subEvents: [string]
  expectedGuests: number
  createdAt: string
  status: string
}

export interface ServiceListType {
  _id: string
  vendorProfile: Omit<VendorProfileType, "services">
  // permission: [string]
  subEvent: Omit<SubEventType, "channels">
  estimatedGuests: string
  status: string
  offerBy: string
  servicesOffering: ServiceType
  planSelected: ItemType
  paymentStatus: string
  createdAt: string
}

export interface TodoType {
  _id: string
  eventId: string
  name: string
  completed: boolean
  createdAt: string
  updatedAt: string
}
export interface EventFull extends EventShortType {
  isHosted: boolean
  isGuest: UserListType | undefined
  isVendor: ServiceListType[] | undefined
  subEvents: SubEventType[]
  userList: UserListType[]
  serviceList: ServiceListType[]
  checkList: TodoType[]
}

export interface UserType {
  userId: string
  name: string
  email: string
  profileImage?: string
  isVendor: boolean
  vendorProfile: VendorProfileType | null
  phoneNo: string | undefined
  myChats: OtherUserType[]
  socketToken: string
  events: EventShortType[]
  notifications: NotificationsType[]
  serviceEvents: EventShortType[]
  createdAt: string
  updatedAt: string
}

export interface SubEventShort {
  _id: string
  name: string
  startDate: string
  endDate: string
  venue: string
}

export interface ServiceTypeNotifications {
  _id: string
  vendorProfile: {
    _id: string
    user: string
    services: String[]
    createdAt: string
  }
  subEvent: SubEventShort
  estimatedGuests: string
  status: string
  offerBy: string
  servicesOffering: ServiceType
  planSelected: {
    name: string
    description: string
    price: number
  }
  paymentStatus: string
  createdAt: string
}
export interface NotificationsType {
  _id: string
  name: string
  host: OtherUserType
  startDate: string
  endDate: string
  userList: {
    _id: string
    user: string
    subEvents: SubEventShort[]
    status: string
    createdAt: string
    updatedAt: string
  }
  serviceList: ServiceTypeNotifications[]
}
export interface ServiceSearchType {
  _id: string
  serviceName: string
  serviceDescription: string
  serviceImage: string
  vendorProfileId: {
    _id: string
    user: OtherUserType
  }
  items: ItemType[]
}

export interface ChatMessage {
  _id: string
  senderId: string
  message: string
  image: string[]
  createdAt: string
  updatedAt: string
  chatId: string
}

export interface ChannelDetails {
  _id: string
  name: string
  type: string
  allowedUsers: OtherUserType[]
  createdAt: string
}
