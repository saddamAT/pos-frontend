import { POST } from './api'

import { ENDPOINTS } from './vars/vars'

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

export async function getUserSubscription(businessId?: number): Promise<GetApiResponse<any>> {
  return apiRequest(
    'GET',
    `${getSubscriptionsBaseUrl()}/`,
    undefined,
    true,
    businessId ? { 'X-Business-ID': String(businessId) } : undefined
  )
}

export async function createUserSubscription(data: CreationSubscription): Promise<any> {
  try {
    const url = `subscriptions/${ENDPOINTS.subscriptions}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating User subscription')
    }
  }
}

export async function updateUserSubscription(
  subscriptionId: string,
  businessId: number,
  data: CreationSubscription
): Promise<GetApiResponse<any>> {
  return apiRequest('POST', `${getSubscriptionsBaseUrl()}/${subscriptionId}/change_plan/`, data, true, {
    'X-Business-ID': String(businessId)
  })
}
