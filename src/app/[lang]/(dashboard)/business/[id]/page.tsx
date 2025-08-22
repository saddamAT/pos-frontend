import { getBusinessById } from '@/api/business'
import BusinessDetails from './BusinessDetails'
import { BusinessTypeForFile } from '@/api/interface/businessInterface'
import { Typography } from '@mui/material'

type PageProps = {
  params: {
    id: string
    lang: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const BusinessPreview = async ({ params }: PageProps) => {
  const response = await getBusinessById(Number(params.id))

  if (!response.success || !response.data) {
    return <Typography>loading Businesses</Typography>
  }

  return <BusinessDetails businessItemData={response.data as BusinessTypeForFile} />
}

export default BusinessPreview
