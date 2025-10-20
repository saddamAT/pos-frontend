// // 'use server'

// // import { getAuthHeaders } from '@/app/actions/api-headers'
// // import { redirect } from 'next/navigation'

// // type ApiResponse<T> = {
// //   success?: boolean
// //   data?: T
// //   error?: string | object
// //   status?: number
// // }

// // export async function apiRequest<T>(
// //   method: string,
// //   url: string,
// //   data?: Record<string, unknown>
// // ): Promise<ApiResponse<T>> {
// //   try {
// //     const headers = await getAuthHeaders()

// //     const options: RequestInit = {
// //       method,
// //       headers: {
// //         ...headers,
// //         'Content-Type': 'application/json'
// //       },
// //       cache: 'no-store'
// //     }

// //     if (data) {
// //       options.body = JSON.stringify(data)
// //     }

// //     const response = await fetch(url, options)
// //     const status = response.status

// //     if (status === 401) {
// //       redirect('/en/login')
// //     }

// //     // if (response.status === 401) {
// //     //   redirect('en/login')
// //     // }

// //     if (!response.ok) {
// //       const errorData = await response.json().catch(() => null)
// //       return { success: false, error: errorData || 'Failed to make the request', status }
// //     }

// //     const result = await response.json()
// //     return { success: true, data: result, status }
// //   } catch (error) {
// //     console.error('Network or Server Error:', error)
// //     return { error: 'Something went wrong. Please try again.', success: false }
// //   }
// // }

// // second  code

// // 'use server'
// // import { getAuthHeaders } from '@/app/actions/api-headers'
// // import { redirect } from 'next/navigation'

// // type ApiResponse<T> = {
// //   success?: boolean
// //   data?: T
// //   error?: string | object
// //   status?: number
// // }

// // export async function apiRequest<T>(
// //   method: string,
// //   url: string,
// //   data?: Record<string, unknown>,
// //   shouldRedirectOn401: boolean = false // Add optional parameter to control redirect behavior
// // ): Promise<ApiResponse<T>> {
// //   try {
// //     const headers = await getAuthHeaders()

// //     const options: RequestInit = {
// //       method,
// //       headers: {
// //         ...headers,
// //         'Content-Type': 'application/json'
// //       },
// //       cache: 'no-store'
// //     }

// //     if (data) {
// //       options.body = JSON.stringify(data)
// //     }

// //     const response = await fetch(url, options)
// //     const status = response.status

// //     // Handle 401 based on the parameter
// //     if (status === 401) {
// //       if (shouldRedirectOn401) {
// //         redirect('/en/login')
// //       } else {
// //         // Return 401 status instead of redirecting
// //         const errorData = await response.json().catch(() => null)
// //         return {
// //           success: false,
// //           error: errorData || 'Unauthorized',
// //           status: 401
// //         }
// //       }
// //     }

// //     if (!response.ok) {
// //       const errorData = await response.json().catch(() => null)
// //       return { success: false, error: errorData || 'Failed to make the request', status }
// //     }

// //     const result = await response.json()
// //     return { success: true, data: result, status }
// //   } catch (error) {
// //     console.error('Network or Server Error:', error)
// //     return { error: 'Something went wrong. Please try again.', success: false }
// //   }
// // }

// // third code

// 'use server'
// import { getAuthHeaders } from '@/app/actions/api-headers'
// import { redirect } from 'next/navigation'

// type ApiResponse<T> = {
//   success?: boolean
//   data?: T
//   error?: string | object
//   status?: number
// }

// export async function apiRequest<T>(
//   method: string,
//   url: string,
//   data?: Record<string, unknown>,
//   shouldRedirectOn401: boolean = false // Default to false - no auto redirect
// ): Promise<ApiResponse<T>> {
//   try {
//     const headers = await getAuthHeaders()

//     const options: RequestInit = {
//       method,
//       headers: {
//         ...headers,
//         'Content-Type': 'application/json'
//       },
//       cache: 'no-store'
//     }

//     if (data) {
//       options.body = JSON.stringify(data)
//     }

//     const response = await fetch(url, options)
//     const status = response.status

//     // Handle 401 based on the parameter
//     if (status === 401) {
//       if (shouldRedirectOn401) {
//         // Handle redirect outside try-catch to avoid interference
//         redirect('/en/login')
//         // This line will never execute as redirect throws
//         return { success: false, error: 'Redirecting...', status: 401 }
//       } else {
//         // Return 401 status instead of redirecting
//         const errorData = await response.json().catch(() => null)
//         return {
//           success: false,
//           error: errorData || 'Unauthorized',
//           status: 401
//         }
//       }
//     }

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null)
//       return { success: false, error: errorData || 'Failed to make the request', status }
//     }

//     const result = await response.json()
//     return { success: true, data: result, status }
//   } catch (error) {
//     // Check if the error is from Next.js redirect
//     if (
//       error &&
//       typeof error === 'object' &&
//       'digest' in error &&
//       typeof error.digest === 'string' &&
//       error.digest.includes('NEXT_REDIRECT')
//     ) {
//       // Re-throw redirect errors so they work properly
//       throw error
//     }

//     console.error('Network or Server Error:', error)
//     return { error: 'Something went wrong. Please try again.', success: false }
//   }
// }

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
export async function apiRequest<T>(
  method: string,
  url: string,
  data?: Record<string, unknown>,
  autoRedirectOn401: boolean = true
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders()

  const options: RequestInit = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    body: data ? JSON.stringify(data) : undefined
  }

  let response: Response
  try {
    response = await fetch(url, options)
  } catch (err) {
    console.error('Network error:', err)
    return { success: false, error: 'Network error. Please try again.' }
  }

  const status = response.status

  // ✅ Hard redirect on 401 (default behavior)
  if (status === 401 && autoRedirectOn401) {
    // This throws and short-circuits the function (as intended by Next.js)
    redirect('/en/login')
  }

  // If caller opted out of redirect, surface the 401 as a normal error
  if (status === 401) {
    let errorData: unknown = null
    try {
      errorData = hasJsonBody(response) ? await response.json() : null
    } catch {}
    return {
      success: false,
      error: (errorData as object) || 'Unauthorized',
      status
    }
  }

  // Other non-OK statuses → return structured error
  if (!response.ok) {
    let errorData: unknown = null
    try {
      errorData = hasJsonBody(response) ? await response.json() : null
    } catch {}
    return {
      success: false,
      error: (errorData as object) || 'Failed to make the request',
      status
    }
  }

  // OK → parse data if present
  try {
    const result = hasJsonBody(response) ? await response.json() : (undefined as T | undefined)
    return { success: true, data: result as T, status }
  } catch (err) {
    console.error('JSON parse error:', err)
    return { success: true, data: undefined, status }
  }
}
