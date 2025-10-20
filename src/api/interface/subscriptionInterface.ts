export interface PlanSubscription {
  id: string
  plan: string
  price: string
  invoice_limit: number
  is_active: boolean
  notes: string
  user: number
  business: number
}

// {
//     "id": "b804de53-ef00-421a-be49-c9341e013d83",
//     "plan": "start",
//     "price": "1300.00",
//     "invoice_limit": 22,
//     "is_active": true,
//     "notes": "ytru",
//     "user": 1,
//     "business": 48
// }
