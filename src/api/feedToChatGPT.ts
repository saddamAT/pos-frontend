import { DELETE, GET, GETBYID, PATCH, POST, POSTFILE } from './api'
import { FeedToChatGptType } from './interface/interfaceFeedToGPT'
import { ENDPOINTS } from './vars/vars'
import { apiRequest } from '@/utils/apiRequest'

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getFeedToChatGptBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/whatseat/${ENDPOINTS.feedToChatGPT}`
}

export async function getFeedToChatGpt(): Promise<GetApiResponse<any>> {
  return await apiRequest('GET', `${getFeedToChatGptBaseUrl()}/`)
}

// export async function getFeedToChatGpt(): Promise<any> {
//   try {
//     const url = `whatseat/${ENDPOINTS.feedToChatGPT}/`
//     const response = await GET(url)
//     return response
//   } catch (error: any) {
//     if (error.response) {
//       throw error.response
//     } else {
//       throw new Error('Error in fetching feedToChatGPT data')
//     }
//   }
// }

export async function CreateFeedToGPT(data: FeedToChatGptType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.feedToChatGPT}/`
    const response = await POSTFILE(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating feedToChatGPT')
    }
  }
}
export async function deleteFeedToGPT(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.feedToChatGPT}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting feedToChatGPT')
    }
  }
}

export async function updateFeedToGPT(id: number, data: FeedToChatGptType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.feedToChatGPT}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating feedToChatGPT data')
    }
  }
}

export async function getFeedToGptById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.feedToChatGPT}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching feedToChatGPT data')
    }
  }
}
