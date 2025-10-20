'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import UserBusinessDrop from '@/components/layout/shared/UserBusinessDrop'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useSession } from 'next-auth/react'
import { Typography } from '@mui/material'

const NavbarContent = () => {
  const session = useSession()
  const businessLength = session?.data?.user?.userBusinesses

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
      </div>
      <div className='flex items-center'>
        <LanguageDropdown />
        {businessLength &&
        businessLength.length > 0 &&
        (session?.data?.user?.user_type === 'superadmin' || session?.data?.user?.user_type === 'businessowner') ? (
          <UserBusinessDrop />
        ) : (
          <Typography>No businesses found</Typography>
        )}

        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
