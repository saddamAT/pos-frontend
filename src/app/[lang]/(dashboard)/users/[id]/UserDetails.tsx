// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { useEffect, useState } from 'react'
import { getUserById } from '@/api/user'
import { User } from '@/api/interface/userInterface'

type PreviewUserProps = {
  id: string
}

// MenuDataType
const UserDetails = ({ id }: PreviewUserProps) => {
  const [userItemData, setUserItemData] = useState<User | null>(null)
  // Vars

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(Number(id))

        setUserItemData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchUser()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>User Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Company Name:
                </Typography>
                <Typography>{userItemData && userItemData.name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  First Name:
                </Typography>
                <Typography>{userItemData && userItemData?.first_name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Last Name:
                </Typography>
                <Typography>{userItemData && userItemData?.last_name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  User Type:
                </Typography>
                <Typography>{userItemData && userItemData?.user_type}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Typography>{userItemData && userItemData?.status}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Country:
                </Typography>
                <Typography>{userItemData && userItemData?.country}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  City:
                </Typography>
                <Typography>{userItemData && userItemData?.city}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Postal Code Delivery:
                </Typography>
                <Typography>{userItemData && userItemData?.postalCode}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Address:
                </Typography>
                <Typography>{userItemData && userItemData?.address}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Mobile:
                </Typography>
                <Typography>{userItemData && userItemData?.mobile}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
