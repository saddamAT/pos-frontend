export type UserSubscription = {
  id: string
  user: string
  company: string
  invoiceLimit: number
  isActive: boolean
  is_active: boolean
  business: string
  notes: string
  plan: string
  price: string
  startedAt: string
  updatedAt: string
}

export type CreationSubscription = {
  plan: string
  price: number
  trial_limit: number
  notes: string
  company?: string
  business: number
  user: number
  is_active: boolean
}
