// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import ConnectionsTeams from './ConnectionsTeams'
import ProfileAboutCard from './ProfileAboutCard'

const ProfileTab = ({ data }: { data?: ProfileTabType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <ProfileAboutCard />
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <ConnectionsTeams connections={data?.connections} teamsTech={data?.teamsTech} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
