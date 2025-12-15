// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AccountDetails from '@/components/account-settings/AccountDetails'

const Account = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AccountDetails />
      </Grid>
    </Grid>
  )
}

export default Account
