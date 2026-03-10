// Next Imports
import type { Metadata } from 'next'

// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import AcceptInvitation from '@/components/invitations/on-boarding/AcceptInvitation'
import { log } from 'console'
import { getMembersInvitationList } from '@/api/invitations'

export const metadata: Metadata = {
  title: 'Accept InvitationPage',
  description: 'Accept Invitation'
}

type PageProps = {
  params: Promise<{ token: string }>
}

const AcceptInvitationPage = async ({ params }: PageProps) => {
  // Vars
  const mode = getServerMode()

  const { token } = await params
  console.log('token', token)
  // const invitationRes = await getUserInvitationByToken(token)

  const invitationRes = await getMembersInvitationList()
  const invitations = invitationRes?.data?.results ?? []

  console.log(invitations, 'invitations')

  // 🔑 Match token
  const matchedInvitation = invitations.find((inv: any) => inv.token === token)

  console.log(matchedInvitation, 'invitationRes')

  const userExists = Boolean(matchedInvitation)
  // const email = matchedInvitation?.email ?? null

  return <AcceptInvitation mode={mode} token={token} invitationRes={matchedInvitation} userExistsRes={userExists} />
}

export default AcceptInvitationPage
