// MUI Imports
import Grid from '@mui/material/Grid'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import ToppingDetails from './ToppingDetails'
import { getToppingsById } from '@/api/toppings'
import { ToppingDataTypeWithObjects } from '@/api/interface/toppingInterface'

type PageProps = {
  params: {
    id: string
    lang: Locale
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const ToppingDetailsPreview = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)
  const response = await getToppingsById(Number(params?.id))
  const toppingItemData: ToppingDataTypeWithObjects | null = response?.data

  // if (!session?.accessToken) {
  //   redirect(`/${params?.lang}/login`)
  // }
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <ToppingDetails toppingItemData={toppingItemData} />
      </Grid>
    </Grid>
  )
}

export default ToppingDetailsPreview
