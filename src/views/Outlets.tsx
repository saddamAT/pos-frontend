// MUI Imports
import Grid from '@mui/material/Grid'

import type { ResturantsType } from '@/types/apps/restoTypes'
import type { getDictionary } from '@/utils/getDictionary'
import type { Mode, SystemMode } from '@core/types'
import OutletListTable from '@/components/outlet/list/OutletListTable'
import { getAllResturants } from '@/api/resturant'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import { Typography } from '@mui/material'

type OutletsListProps = {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  mode?: Mode
  systemMode?: SystemMode
  restoData?: ResturantsType[]
}

const OutletsList = async (props: OutletsListProps) => {
  const { dictionary, mode, systemMode, restoData } = props
  const response = await getAllResturants()
  const restoResponse: ResturantsType[] = response?.data?.results ?? []
  const res = await getAllBusiness()
  const userBusinessRes: BusinessType[] = res?.data?.results ?? []

  if (!response.success || !response.data) {
    return <Typography>loading Outlets</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OutletListTable tableData={restoResponse} userBusiness={userBusinessRes} />
      </Grid>
    </Grid>
  )
}

export default OutletsList
