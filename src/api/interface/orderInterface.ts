export interface OrderDataType {
  id: number
  status: string
  delivery_type: string
  address: string
  cart_data: null // You may want to specify a type if cart_data can hold different structures.
  special_instruction: string
  tax_price: string
  net_price: string
  total_price: string
  user: number
  restaurant: number
  first_name?: string
  name?: string
  is_pos: boolean
}

export interface OrderItem {
  id: number
  name: string
  description: string
  product_sku: string
  quantity: number
  size: 'small' | 'medium' | 'large' // Assuming these are the possible sizes
  spice_level: 'mild' | 'normal' | 'hot' // Assuming possible spice levels
  extra_toppings?: string // Optional field
  instruction?: string // Optional field
  net_price: string // Consider using number if possible
  tax_price: string // Consider using number if possible
  total_price: string // Consider using number if possible
  order: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' // Assuming possible statuses
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

// Interface for an individual order item
export interface CreateOrderItem {
  product_sku: string
  quantity: number
  description: string
  size: string
  spice_level: string
  extra_toppings: string
  instruction: string
  tax_price: string // Consider using number if possible
  net_price: string // Consider using number if possible
  total_price: string // Consider using number if possible
}

// Interface for the overall order
export interface CreateOrder {
  restaurant: number
  business: number
  delivery_type: string // Using a union type for predefined options
  address: string
  special_instruction: string
  is_pos: boolean
  order_number: string
  tax_price: string // Consider using number if possible
  net_price: string // Consider using number if possible
  total_price: string // Consider using number if possible
  order_items: CreateOrderItem[]
}
