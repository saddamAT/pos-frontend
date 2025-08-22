import { getAllBusiness } from '@/api/business'
import BusinessListTable from '@/components/business/list/BusinessListTable'
import { BusinessTypeForFile } from '@/api/interface/businessInterface'
import Grid from '@mui/material/Grid'
import { getAllCurrencies } from '@/api/currencies'
import { CurrencyDataType } from '@/api/interface/currencyInterface'
import { Typography } from '@mui/material'

const BusinessList = async () => {
  const response = await getAllBusiness()
  const businesses: BusinessTypeForFile[] = response?.data?.results ?? []
  const res = await getAllCurrencies()
  const currencies: CurrencyDataType[] = res?.data?.results ?? []

  if (!response?.success) {
    return <Typography>loading Businesses</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BusinessListTable tableData={businesses} currencies={currencies} />
      </Grid>
    </Grid>
  )
}

export default BusinessList
