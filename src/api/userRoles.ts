'use server'

import { apiRequest } from '@/utils/apiRequest'
import { UserRole } from './interface/userInterface'

// import { UserRole } from '#/src/types/apps/userTypes'
// import { apiRequest } from '#/src/utils/apiRequest'

type ApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getUserRoleBaseUrl = (): string => {
  const apiUrl = process.env.API_URL
  if (!apiUrl) throw new Error('Missing API_URL environment variable')
  return `${apiUrl}/user/user-role`
}

// GET ALL USER ROLES
export async function getUserRoles(): Promise<ApiResponse<UserRole[]>> {
  return await apiRequest('GET', `${getUserRoleBaseUrl()}/`)
}
