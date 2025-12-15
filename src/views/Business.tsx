import BusinessListTable from '@/components/business/list/BusinessListTable'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import { getUserBusinessesById } from '@/api/user'
import { getAllCurrencies } from '@/api/currencies'
import type { BusinessTypeForFile } from '@/api/interface/businessInterface'
import type { CurrencyDataType } from '@/api/interface/currencyInterface'

type BusinessListProps = {
  loggedInUserId: number
}

const BusinessList = async ({ loggedInUserId }: BusinessListProps) => {
  // ⭐ Run both API calls in parallel (faster + cleaner)
  const [businessRes, currencyRes] = await Promise.all([getUserBusinessesById(loggedInUserId), getAllCurrencies()])

  // ⭐ Simple error message instead of "loading"
  if (!businessRes?.success) {
    return <Typography>Failed to load businesses</Typography>
  }

  const businesses: BusinessTypeForFile[] = businessRes?.data ?? []
  const currencies: CurrencyDataType[] = currencyRes?.data?.results ?? []

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BusinessListTable tableData={businesses} currencies={currencies} />
      </Grid>
    </Grid>
  )
}

export default BusinessList
