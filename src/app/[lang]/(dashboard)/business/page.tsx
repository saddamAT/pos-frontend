import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import BusinessList from '@/views/Business'

type Props = {
  params: { lang: Locale }
}

export const metadata: Metadata = {
  title: 'Businesses',
  description: 'All Businesses'
}

const BusinessPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  // console.log(session, 'session---9899')

  const loggedInUserId: number = session?.user?.id ?? 0

  // Redirect to login if not authenticated
  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }

  // Redirect if user is neither admin nor superadmin
  const userType = session.user?.user_type
  if (userType !== 'superadmin') {
    redirect(`/${params.lang}/home`)
  }
  return <BusinessList loggedInUserId={loggedInUserId} />
}

export default BusinessPage
