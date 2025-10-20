// MUI Imports
import Grid from '@mui/material/Grid'

import ProductsListTable from '@/components/product/list/ProductsListTable'
import type { MenuesType } from '@/types/apps/menuTypes'
import { getAllMenues } from '@/api/menu'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import { Typography } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { getUserBusinessesById } from '@/api/user'

const ProductsList = async () => {
  const session = await getServerSession(authOptions)
  // console.log(session, 'session---9899')

  const loggedInUserId: number = session?.user?.id ?? 0
  const response = await getAllMenues()
  const menuData: MenuesType[] = response?.data?.results ?? []
  const res = await getUserBusinessesById(loggedInUserId)
  const businesses: BusinessType[] = res?.data ?? []
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
