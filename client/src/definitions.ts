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
  //this is vendorProfileId
  _id: string
  user: OtherUserType
  services: ServiceType[]
  createdAt: string
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
  servicesOffering: ServiceType
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
  vendorProfile: VendorProfileType
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

export interface VendorSearchType extends OtherUserType {
  //_id is vendorProfile id here
  _id: string
  name: string
  email: string
  profileImage: string
  phoneNo: string
  userId: string
  servicesData: ServiceType[]
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
  notifications: NotificationsType[]
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
  vendorList: {
    _id: string
    vendor: string
    subEvents: {
      _id: string
      subEvent: SubEventShort
      status: string
      servicesOffering: ServiceType
      amount: number
      paymentStatus: string
    }[]
    createdAt: string
    updatedAt: string
  }[]
}

export interface InvitesType {
  id: string
  eventId: string
  eventStartDate: string
  eventEndDate: string
  subEventName: string
  eventName: string
  startDate: string
  endDate: string
  venue: string
  host: string
  status: string
  userListId?: string
  vendorListSubEventId?: string
  servicesOffering?: string
}
