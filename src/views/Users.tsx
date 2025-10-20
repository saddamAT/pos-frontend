// MUI Imports
import Grid from '@mui/material/Grid'
import UserListTable from '@/components/user/list/UserListTable'
import type { UsersType } from '@/types/apps/userTypes'
import { getAllUsers, getUserType } from '@/api/user'
import { Typography } from '@mui/material'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'

const UserList = async () => {
  const response = await getAllUsers()
  const userResponse: UsersType[] = response?.data?.results ?? []
  const userTypeResp = await getUserType()
  const userTypeResponse: UsersType[] = userTypeResp?.data?.results ?? []
  const businessResponse = await getAllBusiness()
  const businessData: BusinessType[] = businessResponse?.data?.results ?? []
  if (!response?.success) {
    return <Typography>loading Users</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userResponse} userType={userTypeResponse} businesses={businessData} />
      </Grid>
    </Grid>
  )
}

export default UserList
