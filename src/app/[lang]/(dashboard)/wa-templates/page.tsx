// MUI Imports
import Grid from '@mui/material/Grid'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import TemplateActionsComp from '../home/TemplateActions/TemplateActionsCards'

type Props = {
  params: { lang: Locale }
}

const WATemplates = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TemplateActionsComp />
        </Grid>
      </Grid>
    </>
  )
}

export default WATemplates
