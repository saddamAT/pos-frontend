// import Pricing from '#/src/components/pricing'
import Pricing from '@/components/pricing'
import PosPricing from '@/components/pricing/PosPricing'
import { authOptions } from '@/libs/auth'
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

  if (!user) {
    redirect(`/${lang}/home`)
  }
  return (
    <>
      <PosPricing />
    </>
  )
}

export default PricePage
