import type { BusinessEditPayload, BusinessDataTypeForAddBusiness } from './interface/businessInterface'
import { DELETE, PATCH, POSTFILE, SEARCHBYPARAMSPAGINATION } from './api'
import { ENDPOINTS } from './vars/vars'
import { apiRequest } from '@/utils/apiRequest'

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getUserBusinessBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/whatseat/${ENDPOINTS.userbusinesses}`
}

export async function getBusinessById(id: number): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getUserBusinessBaseUrl()}/${id}/`)
}

export async function getAllBusiness(): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getUserBusinessBaseUrl()}/`)
}

export async function getPaginatedBusiness(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
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

export async function createBusiness(data: BusinessDataTypeForAddBusiness): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/`
    const response = await POSTFILE(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating business')
    }
  }
}

export async function deleteBusiness(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting userbusinesses')
    }
  }
}

export async function updateBusiness(id: number, data: BusinessEditPayload): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating userbusinesses data')
    }
  }
}
