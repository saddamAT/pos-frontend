'use server'

import { getAuthHeaders } from '@/app/actions/api-headers'
import { redirect } from 'next/navigation'

type ApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

export async function apiRequest<T>(
  method: string,
  url: string,
  data?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()

    const options: RequestInit = {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (response.status === 401) {
      redirect('en/login')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return { error: errorData || 'Failed to make the request' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Network or Server Error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}
