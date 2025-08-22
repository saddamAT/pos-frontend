import type { Metadata } from 'next'
import Grid from '@mui/material/Grid'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'

type Props = {
  params: { lang: Locale }
}

import WhatsppAppListTable from '@/views/apps/wa-templates/list/WhatsAppListTable'
import InstagramTableList from '@/views/apps/wa-templates/list/InstagramListTable'
import FaceBookListTable from '@/views/apps/wa-templates/list/FaceBookListTable'
import TelagramListTable from '@/views/apps/wa-templates/list/TelagramListTable'
import FeedToGptListTable from '@/views/apps/wa-templates/list/FeedToGptListTable'
import ChatGptListTable from '@/views/apps/wa-templates/list/ChatGptListTable'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { GetWhatsApp } from '@/api/whatsapp'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'

export const metadata: Metadata = {
  title: 'Platforms ',
  description: 'Platforms'
}

const Platforms = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  const response = await getFeedToChatGpt()

  const feedToChatGpt: FeedToChatGptFileType[] = response?.data?.results ?? []
  const businessRes = await getAllBusiness()
  const businesses: BusinessType[] = businessRes?.data?.results ?? []

  // const whatsAppResponse = await GetWhatsApp()
  // const feedToWhatsApp: WhatsAppDataType[] = whatsAppResponse?.data?.results ?? []

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FeedToGptListTable tableData={feedToChatGpt} businesses={businesses} />
        </Grid>
        <Grid item xs={12}>
          <WhatsppAppListTable
            // tableData={feedToWhatsApp}
            businesses={businesses}
            feedToChatGpt={feedToChatGpt}
          />
        </Grid>
        <Grid item xs={12}>
          <ChatGptListTable businesses={businesses} />
        </Grid>
        <Grid item xs={12}>
          <FaceBookListTable businesses={businesses} feedToChatGpt={feedToChatGpt} />
        </Grid>
        <Grid item xs={12}>
          <InstagramTableList businesses={businesses} feedToChatGpt={feedToChatGpt} />
        </Grid>
        <Grid item xs={12}>
          <TelagramListTable businesses={businesses} feedToChatGpt={feedToChatGpt} />
        </Grid>
      </Grid>
    </>
  )
}

export default Platforms
