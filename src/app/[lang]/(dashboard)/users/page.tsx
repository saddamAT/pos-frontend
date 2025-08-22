import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import Users from '@/views/Users'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

export const metadata: Metadata = {
  title: 'Users',
  description: 'All Users'
}

type Props = {
  params: { lang: Locale }
}

const UsersPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated
  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }

  // Redirect if user is neither admin nor superadmin
  const userType = session.user?.user_type
  if (userType !== 'admin' && userType !== 'superadmin') {
    redirect(`/${params.lang}/home`)
  }

  return <Users />
}

export default UsersPage
