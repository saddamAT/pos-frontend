import BusinessListTable from '@/components/business/list/BusinessListTable'
import { BusinessTypeForFile } from '@/api/interface/businessInterface'
import Grid from '@mui/material/Grid'
import { getAllCurrencies } from '@/api/currencies'
import { CurrencyDataType } from '@/api/interface/currencyInterface'
import { Typography } from '@mui/material'
import { getUserBusinessesById } from '@/api/user'

type BusinessListProps = {
  loggedInUserId: number
}

const BusinessList = async ({ loggedInUserId }: BusinessListProps) => {
  const response = await getUserBusinessesById(loggedInUserId)
  // console.log(response, 'response')

  const businesses: BusinessTypeForFile[] = response?.data ?? []
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
