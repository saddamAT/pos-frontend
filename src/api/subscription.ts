import { GET, POST, DELETE, PUT, PATCH, GETNOAUTH, POSTNOAUTH, GETBYID } from './api'

import { ENDPOINTS } from './vars/vars'
import axios from 'axios'
import { CreationSubscription } from '@/types/apps/subscriptions'
import { apiRequest } from '@/utils/apiRequest'

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getSubscriptionsBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/subscriptions/${ENDPOINTS.subscriptions}`
}

export async function getUserSubscription(): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getSubscriptionsBaseUrl()}/`)
}

export async function updateUserSubscription(id: number, data: CreationSubscription): Promise<any> {
  try {
    const url = `subscriptions/${ENDPOINTS.subscriptions}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating User subscriptions')
    }
  }
}
