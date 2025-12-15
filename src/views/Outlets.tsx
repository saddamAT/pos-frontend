import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

import OutletListTable from '@/components/outlet/list/OutletListTable'

import { getAllResturants } from '@/api/resturant'
import { getUserBusinessesById } from '@/api/user'

import type { ResturantsType } from '@/types/apps/restoTypes'
import type { BusinessType } from '@/api/interface/businessInterface'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

type OutletsListProps = {
  dictionary?: any
  mode?: any
  systemMode?: any
  restoData?: ResturantsType[]
}

const OutletsList = async (props: OutletsListProps) => {
  const session = await getServerSession(authOptions)
  const loggedInUserId: number = session?.user?.id ?? 0

  // Extract props (optional)
  const { dictionary, mode, systemMode, restoData } = props

  // ⭐ Fetch restaurants + user businesses IN PARALLEL
  const [restoRes, businessRes] = await Promise.all([getAllResturants(), getUserBusinessesById(loggedInUserId)])

  // Error handling
  if (!restoRes?.success || !restoRes?.data) {
    return <Typography>Failed to load outlets</Typography>
  }

  const restos: ResturantsType[] = restoRes?.data?.results ?? []
  const userBusinesses: BusinessType[] = businessRes?.data ?? []

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OutletListTable tableData={restos} userBusiness={userBusinesses} />
      </Grid>
    </Grid>
  )
}

export default OutletsList
