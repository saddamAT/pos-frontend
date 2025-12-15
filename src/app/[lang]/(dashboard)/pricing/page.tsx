// import Pricing from '#/src/components/pricing'
import Pricing from '@/components/pricing'
import PosPricing from '@/components/pricing/PosPricing'
import { data } from '@/data/pricingData'
// import { authOptions } from '#/src/libs/auth'
// import { getServerSession } from 'next-auth'
// import { redirect } from 'next/navigation'

const PricePage = async () => {
  //   const session = await getServerSession(authOptions)
  //   const user = session?.user

  //   if (user?.role !== 'admin' || !user) {
  //     redirect('/home')
  //   }
  return (
    <>
      <PosPricing />
      {/* <Pricing data={data} /> */}
    </>
  )
}

export default PricePage
