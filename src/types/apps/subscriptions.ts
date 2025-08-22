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
  price: number | string
  invoice_limit: number | string
  notes: string
  company?: string
}
