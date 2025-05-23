import axios from 'axios'

import type { OrderDataType } from './interface/orderInterface'
import { ENDPOINTS } from './vars/vars'
import { GET, POST, GETBYID, PATCH, SEARCHBYPARAMS, SEARCHBYPARAMSPAGINATION, DELETE } from './api'

export async function getAllOrders(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Orders data')
    }
  }
}

export async function createOrder(data: OrderDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.createOrder}/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating user')
    }
  }
}
// CreateOrder
export async function createOrderUsingMenuSearch(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}/create/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Order')
    }
  }
}

export async function returnOrderUsingOrderSearch(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}/create/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Order')
    }
  }
}

export async function searchMenu(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menuSearch}`
    const response = await SEARCHBYPARAMS(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Orders data')
    }
  }
}

export async function searchOrder(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orderSearch}`
    const response = await SEARCHBYPARAMS(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Orders data')
    }
  }
}

// SEARCHBYPARAMS

// export async function deleteOrder(id: string): Promise<any> {
//   try {
//     const response = await axios.delete('api/order/delete', {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': ''
//       },
//       data: id
//     })

//     return response
//   } catch (error: any) {
//     if (error.response) {
//       throw error.response
//     } else {
//       throw new Error('Error in deleting order')
//     }
//   }
// }

export async function deleteOrder(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting Order data')
    }
  }
}

export async function getOrderById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order data')
    }
  }
}

export async function updateOrder(id: number, data: OrderDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating orders data')
    }
  }
}

export async function getPaginatedOrders(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.orders}`
    const response = await SEARCHBYPARAMSPAGINATION(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business data')
    }
  }
}
