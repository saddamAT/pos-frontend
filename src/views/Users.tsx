// MUI Imports
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

// Components
import UserListTable from '@/components/user/list/UserListTable'

// Types
import type { UsersType } from '@/types/apps/userTypes'
import type { BusinessType } from '@/api/interface/businessInterface'

// API
import { getAllUsers, getUserType } from '@/api/user'
import { getAllBusiness } from '@/api/business'

const UserList = async () => {
  const results = await Promise.allSettled([getAllUsers(), getUserType(), getAllBusiness()])

  const usersRes = results[0].status === 'fulfilled' ? results[0].value : null

  const userTypesRes = results[1].status === 'fulfilled' ? results[1].value : null

  const businessesRes = results[2].status === 'fulfilled' ? results[2].value : null

  if (!usersRes?.success) {
    return <Typography>Failed to load users</Typography>
  }

  const users: UsersType[] = usersRes?.data?.results ?? []
  const userTypes: UsersType[] = userTypesRes?.data?.results ?? []
  const businesses: BusinessType[] = businessesRes?.data?.results ?? []

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={users} userType={userTypes} businesses={businesses} />
      </Grid>
    </Grid>
  )
}

export default UserList
