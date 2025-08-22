// MUI Imports
'use client'
import Grid from '@mui/material/Grid'
import { redirect } from 'next/navigation'

import { type Locale } from '@/configs/i18n'
import SizeListTable from '@/components/size/list/SizeListTable'
import AddSize from './AddSize'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

type PageProps = {
  params: {
    id: string
    lang: Locale
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const SizePreview = ({ params }: PageProps) => {
  const { data } = useSession()

  if (!data?.accessToken) {
    redirect(`/${params?.lang}/login`)
  }
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const handleStateChange = (isCreated: boolean): void => {
    setIsCreated(isCreated)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AddSize id={params.id} isCreated={isCreated} onCreateSize={handleStateChange} />
      </Grid>
      <Grid item xs={12}>
        <SizeListTable id={params.id} isCreated={isCreated} />
      </Grid>
    </Grid>
  )
}

export default SizePreview
