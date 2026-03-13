export interface User {
  id?: number
  name: string
  first_name: string
  last_name: string
  email: string
  user_type?: string
  password?: string
  country: string
  city: string
  address: string
  mobile: string
  verifyPassword?: string
  status: string
  createdAt?: string
  postalCode?: string | undefined
  deleted?: boolean
  isLoggedIn?: boolean
  isChecked: boolean
}

export interface RegisterUserType {
  id?: number
  name: string
  first_name: string
  last_name: string
  email: string
  user_type?: number
  password?: string
  country: string
  city: string
  address: string
  mobile: string
  verifyPassword?: string
  status: string
  createdAt?: string
  postalCode?: string | undefined
  deleted?: boolean
  isLoggedIn?: boolean
  isChecked: boolean
}

export interface LoginUser {
  email: string
  password?: string
}

export interface verifyUserType {
  email: string
  code: number
}

export interface forgotPasswordUserType {
  email: string
  code?: number
}

export interface resetPasswordUserType {
  new_password: number
  confirm_password?: number
}

export interface updateUserPasswordData {
  old_password: number
  new_password: number
  confirm_password?: number
}

export interface UserFromLocalStorage {
  createdAt: string
  deleted: boolean
  email: string
  first_name: string
  id: number
  isLoggedIn: boolean
  last_name: string
  postalCode: string
  status: string
  user_type: string
}

export interface UserInvitation {
  id: string
  business: string
  invitedBy: string | null
  role: number
  email: string
  token: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string
  company?: string
  companyDetail?: {
    id: string
    name: string
    email: string
  }
  roleDetail?: {
    id: number
    role: string
  }
}

export interface UserInvitationCreation {
  id?: string
  email: string
  user_type: number
}

export interface UserCreation {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  mobile: string
  address: string
  role: number | string
  profileLink?: string | null
  company?: string
  user_role?: number | string
  status?: string
}

export interface CompanyUserInvitation {
  company: string
  user: string | UserInvi // Adjusted to allow string or User type
  id: string
}

export interface CompanyUser {
  company: string
  companyDetails: {
    createdAt: string
    createdBy: string
    deletedAt: string | null
    email: string
    id: string
    name: string
    schemaName: string
    status: 'Pending' | 'Active' | 'Inactive' // adjust if more statuses exist
    updatedAt: string
  }
  role: {
    active: boolean
    description: string
    id: number
    role: string
  }
  user: User
  id: string
}

export interface CreateInvitationRequest {
  role?: number
  email: string
  company?: string
  user_type?: number
  business?: number
}

export interface UserRole {
  id: string
  active: boolean
  role: string
  description: string
}

export interface UserInvi {
  createdAt: string
  deleted: boolean
  email: string
  firstName: string
  id: string
  isLoggedIn: boolean
  lastName: string
  status: 'Active' | 'Inactive' // adjust as needed
  userRole: string
}

export interface CheckUserExistsResponse {
  exists: boolean
  user?: UserInvi
}

export interface AcceptInvitationPayload {
  id: string
  email: string
  token: string
  accepted_at: string | null
  expires_at: string
  created_at: string
  business: number
  branch: number | null
  invited_by: number
  role: number | null
}

export interface BusinessOwner {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type: string
  city: string
  country: string
  status: string
  address: string
  name: string
  mobile: string
  createdAt: string
  postalCode: string
  deleted: boolean
  isLoggedIn: boolean
}
