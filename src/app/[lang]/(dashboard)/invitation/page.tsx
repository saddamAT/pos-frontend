import InvitationsClient from '@/components/invitations/InvitationsClient'
import { authOptions } from '@/libs/auth'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    lang: string // this will be "en"
  }
}

const InvitationPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const { lang } = params

  if (!user || user.user_type !== 'superadmin') {
    redirect(`/${lang}/home`)
  }

  return <InvitationsClient />
}

export default InvitationPage
