import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type Props = {
  params: { lang: Locale }
}

import OutletsList from '@/views/Outlets'

export const metadata: Metadata = {
  title: 'Outlets',
  description: 'All Outlets'
}

const OutletsPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated
  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }

  return <OutletsList />
}

export default OutletsPage
