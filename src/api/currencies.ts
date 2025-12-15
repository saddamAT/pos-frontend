import { ENDPOINTS } from './vars/vars'
import { apiRequest } from '@/utils/apiRequest'

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getCurrencyBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/whatseat/${ENDPOINTS.currencies}`
}

export async function getAllCurrencies(): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getCurrencyBaseUrl()}/`)
}
