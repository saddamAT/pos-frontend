// MUI Imports
import Grid from '@mui/material/Grid'
import SizeDetails from './SizeDetails'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import { getMenuSizeById } from '@/api/size'
import { SizeDataType } from '@/api/interface/sizeInterface'

type PageProps = {
  params: {
    id: string
    lang: Locale
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const SizeDetailsPreview = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)
  const response = await getMenuSizeById(Number(params?.id))

  const menuSizeItemData: SizeDataType | null = response?.data

  if (!session?.accessToken) {
    redirect(`/${params?.lang}/login`)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SizeDetails menuSizeItemData={menuSizeItemData} />
      </Grid>
    </Grid>
  )
}

export default SizeDetailsPreview
