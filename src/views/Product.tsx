// MUI Imports
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

// Table Component
import ProductsListTable from '@/components/product/list/ProductsListTable'

// API
import { getAllMenues } from '@/api/menu'
import { getUserBusinessesById } from '@/api/user'

// Types
import type { MenuesType } from '@/types/apps/menuTypes'
import type { BusinessType } from '@/api/interface/businessInterface'

// Auth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const ProductsList = async () => {
  const session = await getServerSession(authOptions)
  const loggedInUserId: number = session?.user?.id ?? 0

  // ⭐ Fetch Menus + User Businesses in parallel
  const [menuRes, businessRes] = await Promise.all([getAllMenues(), getUserBusinessesById(loggedInUserId)])

  // ❗ Handle API failure properly
  if (!menuRes?.success || !menuRes?.data) {
    return <Typography>Failed to load products</Typography>
  }

  const menus: MenuesType[] = menuRes?.data?.results ?? []
  const businesses: BusinessType[] = businessRes?.data ?? []

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProductsListTable tableData={menus} businesses={businesses} />
      </Grid>
    </Grid>
  )
}

export default ProductsList
