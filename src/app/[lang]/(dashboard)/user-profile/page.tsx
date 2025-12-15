// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfile from '@components/user-profile'
import { userDb } from '@/fake-db/billing-plans'
const ProfileTab = dynamic(() => import('@components/user-profile/profile'))

// Vars
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />
})

const ProfilePage = async () => {
  return <UserProfile data={userDb} tabContentList={tabContentList(userDb)} />
}

export default ProfilePage
