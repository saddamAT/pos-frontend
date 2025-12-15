// MUI Imports
import Grid from '@mui/material/Grid'

import OrderListTable from '@/components/order/list/OrderListTable'
import type { OrdersType } from '@/types/apps/orderTypes'
import OrderCards from './OrderCards'
import { getAllOrders } from '@/api/order'
import { Typography } from '@mui/material'

const OrdersList = async () => {
  const response = await getAllOrders()
  const orderResponse: OrdersType[] = response?.data?.results ?? []

  if (!response?.success) {
    return <Typography>loading Orders</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OrderCards />
      </Grid>
      <Grid item xs={12}>
        <OrderListTable tableData={orderResponse} />
      </Grid>
    </Grid>
  )
}

export default OrdersList
