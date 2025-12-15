import type { Metadata } from 'next'
// import { redirect } from 'next/navigation'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type Props = {
  params: { lang: Locale }
}
import Product from '@/views/Product'

export const metadata: Metadata = {
  title: 'Products',
  description: 'All Products'
}

const ProductsPage = async ({ params }: Props) => {
  // const session = await getServerSession(authOptions)
  // console.log(session, 'session---9899')

  // if (!session?.accessToken) {
  //   redirect(`/${params.lang}/login`)
  // }
  return <Product />
}

export default ProductsPage
