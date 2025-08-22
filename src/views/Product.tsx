// MUI Imports
import Grid from '@mui/material/Grid'

import ProductsListTable from '@/components/product/list/ProductsListTable'
import type { MenuesType } from '@/types/apps/menuTypes'
import { getAllMenues } from '@/api/menu'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import { Typography } from '@mui/material'

const ProductsList = async () => {
  const response = await getAllMenues()
  const menuData: MenuesType[] = response?.data?.results ?? []
  const res = await getAllBusiness()
  const businesses: BusinessType[] = res?.data?.results ?? []
  if (!response?.success) {
    return <Typography>loading Products</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProductsListTable tableData={menuData} businesses={businesses} />
      </Grid>
    </Grid>
  )
}

export default ProductsList
