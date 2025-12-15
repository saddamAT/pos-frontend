// import { getUserInvitations } from '#/src/app/actions/invitations'
import { UserInvitation } from '@/api/interface/userInterface'
import { getUserInvitations } from '@/api/invitations'
import Invitations from '@/components/invitations/list/InvitationsTableList'
import { authOptions } from '@/libs/auth'
import { Typography } from '@mui/material'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    lang: string // this will be "en"
  }
}

const PricePage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const { lang } = params

  if (!user || user.user_type !== 'superadmin') {
    redirect(`/${lang}/home`)
  }

  const invitationResponse = await getUserInvitations()

  if (!invitationResponse?.success) {
    return <Typography>loading invitations</Typography>
  }

  const invitations: UserInvitation[] = invitationResponse?.data?.results ?? []

  return <Invitations invitationData={invitations} />
}

export default PricePage
