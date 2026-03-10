'use server'
import { getAuthHeaders } from '@/app/actions/api-headers'
import { redirect } from 'next/navigation'

type ApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
  status?: number
}

function hasJsonBody(response: Response) {
  if (response.status === 204) return false
  const ct = response.headers.get('content-type') || ''
  return ct.includes('application/json')
}

/**
 * Server-side API wrapper.
 * - Redirects to /en/login on 401 by default (can be disabled).
 * - Returns { success, data, error, status } for other cases.
 */
// export async function apiRequest<T>(
//   method: string,
//   url: string,
//   data?: Record<string, unknown>,
//   autoRedirectOn401: boolean = true
// ): Promise<ApiResponse<T>> {
//   const headers = await getAuthHeaders()

//   const options: RequestInit = {
//     method,
//     headers: {
//       ...headers,
//       'Content-Type': 'application/json'
//     },
//     cache: 'no-store',
//     body: data ? JSON.stringify(data) : undefined
//   }

//   let response: Response
//   try {
//     response = await fetch(url, options)
//   } catch (err) {
//     console.error('Network error:', err)
//     return { success: false, error: 'Network error. Please try again.' }
//   }

//   const status = response.status

//   // ✅ Hard redirect on 401 (default behavior)
//   if (status === 401 && autoRedirectOn401) {
//     // This throws and short-circuits the function (as intended by Next.js)
//     redirect('/en/login')
//   }

//   // If caller opted out of redirect, surface the 401 as a normal error
//   if (status === 401) {
//     let errorData: unknown = null
//     try {
//       errorData = hasJsonBody(response) ? await response.json() : null
//     } catch {}
//     return {
//       success: false,
//       error: (errorData as object) || 'Unauthorized',
//       status
//     }
//   }

//   // Other non-OK statuses → return structured error
//   if (!response.ok) {
//     let errorData: unknown = null
//     try {
//       errorData = hasJsonBody(response) ? await response.json() : null
//     } catch {}
//     return {
//       success: false,
//       error: (errorData as object) || 'Failed to make the request',
//       status
//     }
//   }

//   // OK → parse data if present
//   try {
//     const result = hasJsonBody(response) ? await response.json() : (undefined as T | undefined)
//     return { success: true, data: result as T, status }
//   } catch (err) {
//     console.error('JSON parse error:', err)
//     return { success: true, data: undefined, status }
//   }
// }

// export async function apiRequest<T>(
//   method: 'GET' | 'POST' | 'PATCH',
//   url: string,
//   data?: Record<string, unknown>,
//   autoRedirectOn401: boolean = true,
//   extraHeaders?: Record<string, string>
// ): Promise<ApiResponse<T> & { status?: number }> {
//   const headers = await getAuthHeaders()

//   const options: RequestInit = {
//     method,
//     headers: {
//       ...headers,
//       ...extraHeaders,
//       'Content-Type': 'application/json'
//     },
//     cache: 'no-store',
//     body: data ? JSON.stringify(data) : undefined
//   }

//   let response: Response
//   try {
//     response = await fetch(url, options)
//   } catch (err) {
//     console.error('Network error:', err)
//     return { success: false, error: 'Network error. Please try again.' }
//   }

//   const status = response.status

//   if (status === 401 && autoRedirectOn401) {
//     redirect('/en/login')
//   }

//   if (status === 401) {
//     let errorData: unknown = null
//     try {
//       errorData = hasJsonBody(response) ? await response.json() : null
//     } catch {}
//     return { success: false, error: errorData || 'Unauthorized', status }
//   }

//   if (!response.ok) {
//     let errorData: unknown = null
//     try {
//       errorData = hasJsonBody(response) ? await response.json() : null
//     } catch {}
//     return { success: false, error: errorData || 'Failed to make the request', status }
//   }

//   try {
//     const result = hasJsonBody(response) ? await response.json() : undefined
//     return { success: true, data: result as T, status }
//   } catch {
//     return { success: true, data: undefined, status }
//   }
// }

export async function apiRequest<TResponse, TBody = undefined>(
  method: 'GET' | 'POST' | 'PATCH',
  url: string,
  data?: TBody,
  autoRedirectOn401: boolean = true,
  extraHeaders?: Record<string, string>
): Promise<ApiResponse<TResponse> & { status?: number }> {
  const headers = await getAuthHeaders()

  const options: RequestInit = {
    method,
    headers: {
      ...headers,
      ...extraHeaders,
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    body: data ? JSON.stringify(data) : undefined
  }

  let response: Response
  try {
    response = await fetch(url, options)
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }

  const status = response.status

  if (status === 401 && autoRedirectOn401) {
    redirect('/en/login')
  }

  if (!response.ok) {
    const errorData = hasJsonBody(response) ? await response.json() : null
    return { success: false, error: errorData || 'Request failed', status }
  }

  const result = hasJsonBody(response) ? await response.json() : undefined
  return { success: true, data: result as TResponse, status }
}
