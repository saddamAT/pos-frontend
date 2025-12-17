'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfileHeader from './UserProfileHeader'

const UserProfile = ({ tabContentList, data }: { tabContentList: { [key: string]: ReactElement }; data?: Data }) => {
  // States
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader data={data?.profileHeader} />
      </Grid>

      <Grid item xs={12} className='flex flex-col gap-6'>
        <TabContext value={activeTab}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default UserProfile
