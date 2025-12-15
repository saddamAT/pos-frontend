// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CurrentPlan from '@/components/billing-plans/CurrentPlan'
import Address from '@/components/billing-plans/Address'
import PaymentMethod from '@/components/billing-plans/PaymentMethod'
import InvoiceListTable from '@/components/billing-plans/InvoiceListTable'

import { billingPlansDb, pricingPlanDb } from '@/fake-db/billing-plans'

const BillingPlans = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlan data={pricingPlanDb} />
      </Grid>
      <Grid item xs={12}>
        <PaymentMethod />
      </Grid>
      <Grid item xs={12}>
        <Address />
      </Grid>
      <Grid item xs={12}>
        <InvoiceListTable invoiceData={billingPlansDb} />
      </Grid>
    </Grid>
  )
}

export default BillingPlans
