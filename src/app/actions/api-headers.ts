import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'

export async function getAuthHeaders(): Promise<Record<string, string>> {
  let session

  if (typeof window === 'undefined') {
    // Server-side
    session = await getServerSession(authOptions)
  } else {
    // Client-side
    session = await getSession()
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (session?.accessToken) {
    headers['Authorization'] = `Token ${session.accessToken}`
  }

  return headers
}
