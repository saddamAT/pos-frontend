export interface CurrencyObject {
  id: number
  code: string
  label: string
  symbol: string
}

export interface BusinessDataType {
  id: number
  business_id: string
  business_address: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: FileList
  contact_number: string
  first_name?: string
  user: UserInterfaceItem
}

export interface UserInterfaceItem {
  id: number
  name: string | null
}

// Interface for Business data
export interface BusinessTypeForGettingBussiness {
  business_address: string
  business_desc: string
  business_id: string
  business_initial: string
  contact_number: string
  created_at: string
  id: number
  updated_at: string
  user: UserType
}

// Interface for User data inside Business
interface UserType {
  createdAt: string
  email: string
  id: number
  name: string | null
  status: string
  user_id: string | null
}

interface User {
  id: number // Changed from string to number to match BusinessType.userId
  fullName?: string
  email?: string
  avatar?: string
  // ... other user properties
}

export interface BusinessId {
  id: number
}

export interface BusinessObject {
  id: number
  name: string
}

export interface BusinessType {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: File
  contact_number: string
  user?: User // Optional User object
  currency: CurrencyObject
  title?: string
  first_name?: string
  email?: string
  business?: any
  business_initial: string
  restaurant: number
  cuisine_type: string
  active: string
  city: string
  name: string
  logo: string
  business_type:
    | 'Fast_food'
    | 'Clothes'
    | 'Shoes'
    | 'Electronics'
    | 'Grocery'
    | 'Salon'
    | 'Pharmacy'
    | 'Books'
    | 'Hardware'
    | 'Furniture'
    | 'Other'
    | string
  // user: UserId
}

export interface UserBusiness {
  id: number
  active: boolean
  business: number
  catalog_link: string
  city: string
  contact_number: string
  created_at: string // ISO date string
  cuisine_type: string
  description: string
  menu: any | null // adjust if you know the actual type
  name: string
  postal_code_delivery: string
  updated_at: string // ISO date string
}

export type UserBusinessesType = {
  id: number
  user: number
  business_id: string
  business_address: string
  business_desc: string
  name: string
  contact_number: string
  business_initial: string
  business_doc: string
  currency: number
  logo: string
  updated_at: string
  created_at: string
  user_business: UserBusiness[]
}

export type BusinessEditPayload = {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  contact_number: string
  business_initial: string
  business_doc?: FileList | string // <-- updated
  name: string
  logo?: FileList | string // <-- updated
  currency?: CurrencyObject
  user?: number
  business_type: string
}

export interface BusinessDataTypeForAddBusiness {
  id?: number
  business_id: string
  business_address: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: FileList
  contact_number: string
  first_name?: string
  user: number
  created_at: Date
  updated_at: Date
  business_initial: string
  name: string
  logo?: FileList
  currency: CurrencyObject
  business: BusinessObject
  business_type: string
}

export type UserId = {
  user: number
}

export type BusinessTypeForFile = {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: string
  contact_number: string
  user?: User // Optional User object
  title?: string
  first_name?: string
  email?: string
  business?: number
  business_initial: string
  restaurant: number
  file: string
  name: string
  logo: string
  currency: CurrencyObject
  business_type: string
}

export type BusinessBranchType = {
  id: number
  active: boolean
  business: number
  name: string
  catalog_link: string
  city: string
  contact_number: string
  created_at: string
  cuisine_type: string
  description: string
  menu: string | null
  postal_code_delivery: string
}
