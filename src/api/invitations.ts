// import { CheckUserExistsResponse, CompanyUserInvitation, UserInvitation } from '#/src/types/apps/userTypes'
import { apiRequest } from '@/utils/apiRequest'
import {
  CheckUserExistsResponse,
  UserInvitation,
  CompanyUserInvitation,
  UserInvitationCreation
} from './interface/userInterface'

type ApiResponse<T> = {
  success?: boolean
  // data?: T
  data?: {
    results: T[]
  }
  error?: string | object
}

type GetApiResponse<T> = {
  success?: boolean
  data?: T
  error?: string | object
}

const getInvitationsBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) throw new Error('Missing API_URL environment variable')
  return `${apiUrl}/user/invitations`
}
const getUserCheckUrl = (): string => {
  const apiUrl = process.env.API_URL
  if (!apiUrl) throw new Error('Missing API_URL environment variable')
  return `${apiUrl}/user/check-user/`
}

// /company-user-invitations/
const getCompanyUserInvitationsBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) throw new Error('Missing NEXT_PUBLIC_API_URL environment variable')
  return `${apiUrl}/user/company-user-invitations`
}

// GET all invitations
export async function getUserInvitations(): Promise<ApiResponse<UserInvitation>> {
  return await apiRequest('GET', `${getInvitationsBaseUrl()}/`)
}

// GET single invitation by token (using lookup_field = 'token')
export async function getUserInvitationByToken(token: string): Promise<GetApiResponse<UserInvitation>> {
  return await apiRequest('GET', `${getInvitationsBaseUrl()}/${token}/`)
}

// ACCEPT invitation
export async function acceptInvitation(token: string): Promise<ApiResponse<any>> {
  return await apiRequest('POST', `${getInvitationsBaseUrl()}/accept/`, { token })
}

export async function checkUserExists(email: string): Promise<GetApiResponse<CheckUserExistsResponse>> {
  return await apiRequest('POST', getUserCheckUrl(), { email })
}

// CREATE new invitation
export async function createUserInvitation(data: Record<string, unknown>): Promise<ApiResponse<any>> {
  return await apiRequest('POST', `${getInvitationsBaseUrl()}/`, data)
}
// POST a new company-user invitation
export async function addCompanyUserInvitation(
  data: Record<string, unknown>
): Promise<ApiResponse<CompanyUserInvitation>> {
  return await apiRequest('POST', `${getCompanyUserInvitationsBaseUrl()}/`, data)
}
