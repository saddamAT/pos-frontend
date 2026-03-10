export type UsersType = {
  id: number
  name: string
  email: string
  first_name: string
  last_name: string
  mobile: string
  postalCode: string
  address: string
  status: string
  user_type: string
  image?: string
  role?: string
  avatar?: string
  fullName?: string
  billing?: string
  currentPlan?: string
  username?: string
  city: string
  country: string
}

export type UserInvitation = {
  id: string
  company: string
  name: string
  invitedBy: string | null
  business: number
  branch: number
  invited_by: string
  role: number
  email: string
  token: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string
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


export type OnBordingInterface = {
	firstName: string
	lastName: string
	email: string
	password: string
	confirmPassword: string
	phoneNumber: string
	address: string
	user_role: number | string
	status: string
	company: {
		name: string
		email?: string
	}
	profileLink?: string | null
	plan: string
	// plan: {
	// 	plan: string
	// 	price: number
	// 	invoice_limit: number
	// 	notes: string
	// 	company: string
	// }
}
