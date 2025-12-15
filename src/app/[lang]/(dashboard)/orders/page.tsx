import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type Props = {
  params: { lang: Locale }
}
import OrdersList from '@/views/Orders'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'All Orders'
}

const OrdersPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  console.log(session?.accessToken, 'token')

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }
  return <OrdersList />
}

export default OrdersPage
