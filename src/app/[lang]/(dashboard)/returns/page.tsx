import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import ReturnOrderListTable from '@/components/return-order/list/ReturnOrderListTable'
import { OrderReturnDataType } from '@/api/interface/orderReturnInterface'
import { getAllOrderReturns } from '@/api/orderReturns'

export const metadata: Metadata = {
  title: 'Return',
  description: 'All Returns'
}
type Props = {
  params: { lang: Locale }
}

const ReturnPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  const response = await getAllOrderReturns()
  const orderReturnResponse: OrderReturnDataType[] = response?.data?.results ?? []

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }

  return <ReturnOrderListTable tableData={orderReturnResponse} />
}

export default ReturnPage
