// MUI Imports
import Grid from '@mui/material/Grid'
import SizeDetails from './SizeDetails'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type PageProps = {
  params: {
    id: string
    lang: Locale
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const SizeDetailsPreview = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect(`/${params?.lang}/login`)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SizeDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default SizeDetailsPreview
