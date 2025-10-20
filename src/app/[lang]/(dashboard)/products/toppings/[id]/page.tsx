'use client'
import Grid from '@mui/material/Grid'
import { redirect } from 'next/navigation'
import { type Locale } from '@/configs/i18n'
import AddToppings from './AddToppings'
import ToppingListTable from '@/components/topping/list/ToppingListTable'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

type PageProps = {
  params: {
    id: string
    lang: Locale
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const ToppingsPreview = ({ params }: PageProps) => {
  const { data } = useSession()

  // if (!data?.accessToken) {
  //   redirect(`/${params?.lang}/login`)
  // }
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const handleStateChange = (isCreated: boolean): void => {
    setIsCreated(isCreated)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AddToppings id={params.id} isCreated={isCreated} onCreateTopping={handleStateChange} />
      </Grid>
      <Grid item xs={12}>
        <ToppingListTable isCreated={isCreated} id={params.id} />
      </Grid>
    </Grid>
  )
}

export default ToppingsPreview
