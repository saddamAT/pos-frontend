export type UserSubscription = {
  id: string
  user: string
  company: string
  invoiceLimit: number
  isActive: boolean
  notes: string
  plan: string
  price: string
  startedAt: string
  updatedAt: string
}

export type CreationSubscription = {
  plan: string
  price: number
  invoice_limit: number
  notes: string
  company?: string
  business: string
  user: number
  is_active: boolean
}
