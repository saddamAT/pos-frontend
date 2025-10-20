'use server'

import { apiRequest } from '@/utils/apiRequest'
import { CompanyUser, UserCreation } from './interface/userInterface'

// import { CompanyUser, UserCreation } from '#/src/types/apps/userTypes'
// import { apiRequest } from '#/src/utils/apiRequest'

type ApiResponse<T> = {
  success?: boolean
  // data?: T
  data?: {
    results: T[]
    // [key: string]: any // in case there are other fields like count, next, previous, etc.
  }
  error?: string | object
}

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getCompanyUserBaseUrl = (): string => {
  const apiUrl = process.env.API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/user/company-users`
}

const getCompanyUserListBaseUrl = (): string => {
  const apiUrl = process.env.API_URL

  if (!apiUrl) throw new Error('Missing API_URL environment variable')

  return `${apiUrl}/user/users`
}

// GET ALL COMPANY USERS LISTS
export async function getCompanyUsersList(): Promise<ApiResponse<any[]>> {
  return await apiRequest('GET', `${getCompanyUserListBaseUrl()}/`)
}

// GET ALL COMPANY USERS
export async function getCompanyUsers(): Promise<ApiResponse<CompanyUser[]>> {
  return await apiRequest('GET', `${getCompanyUserBaseUrl()}/`)
}

// CREATE NEW COMPANY USER
export async function createCompanyUser(userData: Record<string, unknown>): Promise<ApiResponse<any>> {
  return await apiRequest('POST', `${getCompanyUserBaseUrl()}/`, userData)
}

// UPDATE EXISTING COMPANY USER
export async function updateCompanyUser(userData: Record<string, unknown>, id: string): Promise<ApiResponse<any>> {
  return await apiRequest('PATCH', `${getCompanyUserBaseUrl()}/${id}/`, userData)
}

// DELETE COMPANY USER
export async function deleteCompanyUser(id: string): Promise<ApiResponse<null>> {
  return await apiRequest('DELETE', `${getCompanyUserBaseUrl()}/${id}/`)
}

// GET SINGLE COMPANY USER BY ID
export async function getUserById(id: number): Promise<GetApiResponse<UserCreation>> {
  return await apiRequest('GET', `${getCompanyUserListBaseUrl()}/${id}/`)
}
