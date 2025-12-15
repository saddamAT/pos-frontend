import { ENDPOINTS } from './vars/vars'
import { GET, PATCH, POST, DELETE, SEARCHBYIDPARAMS, GETBYID } from './api'
import { SizeDataType, SizeDataTypeWithoutId } from './interface/sizeInterface'

import { apiRequest } from '@/utils/apiRequest'

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getSizeBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')
  return `${apiUrl}/whatseat/${ENDPOINTS.sizes}`
}

export async function getAllSizes(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.sizes}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business menus sizes')
    }
  }
}

export async function createSize(data: SizeDataTypeWithoutId): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.sizes}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating size of business menu')
    }
  }
}

export async function deleteMenuSize(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.sizes}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting business menu size')
    }
  }
}

export async function getBusinessMenuesById(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.businessMenues}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching busines menues data')
    }
  }
}

export async function getMenuSizeById(id: number): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getSizeBaseUrl()}/${id}/`)
}

export async function updateMenuSize(id: number, data: SizeDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.sizes}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in updating Menu size data')
    }
  }
}
export async function syncMenuData(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.syncMenuMeta}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in Syncing Menu Data')
    }
  }
}
