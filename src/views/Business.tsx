import BusinessListTable from '@/components/business/list/BusinessListTable'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import { getAllBusinessOwners, getUserBusinesses, getUserBusinessesById } from '@/api/user'
import { getAllCurrencies } from '@/api/currencies'
import type { BusinessTypeForFile } from '@/api/interface/businessInterface'
import type { CurrencyDataType } from '@/api/interface/currencyInterface'
import { BusinessOwner } from '@/api/interface/userInterface'
import { getAllBusiness } from '@/api/business'

type BusinessListProps = {
  loggedInUserId: number
}

const BusinessList = async ({ loggedInUserId }: BusinessListProps) => {
  // ⭐ Run both API calls in parallel (faster + cleaner)
  const [businessRes, currencyRes, businessOwnerRes] = await Promise.all([
    // getUserBusinessesById(loggedInUserId),
    getAllBusiness(),
    getAllCurrencies(),
    getAllBusinessOwners()
  ])

  // ⭐ Simple error message instead of "loading"
  if (!businessRes?.success) {
    return <Typography>Failed to load businesses</Typography>
  }

  // const businesses: BusinessTypeForFile[] = businessRes?.data ?? []
  const businesses: BusinessTypeForFile[] = businessRes?.data?.results ?? []
  const currencies: CurrencyDataType[] = currencyRes?.data?.results ?? []
  const businessOwners: BusinessOwner[] = businessOwnerRes?.data ?? []
  // console.log(businesses, 'businesses')
  // console.log(businesses, 'businesses')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BusinessListTable tableData={businesses} currencies={currencies} businessOwners={businessOwners} />
      </Grid>
    </Grid>
  )
}

export default BusinessList
