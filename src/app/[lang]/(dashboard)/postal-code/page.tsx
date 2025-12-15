// MUI Imports

import Grid from '@mui/material/Grid'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type Props = {
  params: { lang: Locale }
}

import PostalCodesListTable from '@/components/postal-code/list/PostalCodesListTable'
import { getAllPostalCodes } from '@/api/postalCodes'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'

const PostalCodes = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  const response = await getAllPostalCodes()
  const businessRes = await getAllBusiness()
  const postalCodeResponse: postalCodesDataType[] = response?.data?.results ?? []

  const businesses: BusinessType[] = businessRes?.data?.results ?? []

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <PostalCodesListTable tableData={postalCodeResponse} businesses={businesses} />
      </Grid>
    </Grid>
  )
}

export default PostalCodes
