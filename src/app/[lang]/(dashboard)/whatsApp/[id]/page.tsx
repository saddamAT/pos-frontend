// MUI Imports
import Grid from '@mui/material/Grid'
import WhatsAppDetails from './WhatsAppDetails'
import { getWhatsAppById } from '@/api/whatsapp'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const WhatsAppPreview = async ({ params }: PageProps) => {
  const response = await getWhatsAppById(Number(params?.id))
  const whatsAppItemData: WhatsAppDataType | null = response?.data
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <WhatsAppDetails whatsAppItemData={whatsAppItemData} />
      </Grid>
    </Grid>
  )
}

export default WhatsAppPreview
