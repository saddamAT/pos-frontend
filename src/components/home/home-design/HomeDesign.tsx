'use client'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  styled,
  Typography
} from '@mui/material'
import { ShoppingCart, Sync, Chat, Notifications } from '@mui/icons-material'
import { useState } from 'react'
import { getLocalizedUrl } from '@/utils/i18n'
import { useRouter } from 'next/navigation'
import { Locale } from '@/configs/i18n'
import { useParams } from 'next/navigation'

import type { TimelineProps } from '@mui/lab/Timeline'
import MuiTimeline from '@mui/lab/Timeline'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import { useSession } from 'next-auth/react'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const HomeDesign = () => {
  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()
  const [orders, setOrders] = useState({
    newOrders: 5,
    pendingOrders: 12,
    fulfilledOrders: 28,
    failedOrders: 8,
    returnOrders: 12
  })

  const { data } = useSession()

  let selectedBusinessName = ''

  if (data?.user.userBusinesses && data.user.selectedBusiness?.id) {
    const match = data.user.userBusinesses.find(ub =>
      ub.user_business?.some(b => b.id === data?.user?.selectedBusiness?.id)
    )
    selectedBusinessName = match?.name || selectedBusinessName
  }

  return (
    <>
      <Card>
        <div className='p-6'>
          <div className='mb-6'>
            <div className='flex justify-between items-center'>
              <div className='text-2xl font-bold'>Welcome back, {data?.user?.first_name}!</div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <i className='tabler-calendar text-lg'></i>
                {new Date()
                  .toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })
                  .replace(',', '')}
              </div>
            </div>

            <Typography className='mt-1 font-normal text-[0.9375rem] leading-[1.46667]'>
              You are currently logged in to the {''}
              {data?.user?.selectedBusiness?.name} of {selectedBusinessName}
            </Typography>
          </div>

          {/* Quick Access Section (Single Row) */}
          <div className='flex justify-start mb-1'>
            <Typography variant='h6'>Quick Access</Typography>
          </div>
          <Grid container spacing={3} className='mb-6'>
            <Grid item xs={12} md={12}>
              <div className='border p-4 rounded-[13px] space-y-4'>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                  <Box className='flex flex-col items-center border p-4 rounded-[13px]'>
                    <Button
                      onClick={() => {
                        router.push(getLocalizedUrl('/products', locale))
                      }}
                      className='w-full flex flex-col items-center justify-center py-2'
                    >
                      <i className='tabler-shopping-cart'></i>
                      Products
                    </Button>
                  </Box>

                  <Box className='flex flex-col items-center border p-4 rounded-[13px]'>
                    <Button
                      onClick={() => {
                        router.push(getLocalizedUrl('/orders', locale))
                      }}
                      className='w-full flex flex-col items-center justify-center'
                    >
                      <ShoppingCart />
                      Orders
                    </Button>
                  </Box>

                  <Box className='flex flex-col items-center border p-4 rounded-[13px]'>
                    <Button
                      onClick={() => {
                        router.push(getLocalizedUrl('/products', locale))
                      }}
                      className='w-full flex flex-col items-center justify-center'
                    >
                      <Sync />
                      Catalog Sync
                    </Button>
                  </Box>

                  <Box className='flex flex-col items-center border p-4 rounded-[13px]'>
                    <Button
                      onClick={() => {
                        router.push(getLocalizedUrl('/platforms', locale))
                      }}
                      className='w-full flex flex-col items-center justify-center'
                    >
                      <Chat />
                      Chat Flows
                    </Button>
                  </Box>

                  <Box className='flex flex-col items-center border p-4 rounded-[13px]'>
                    <Button
                      onClick={() => {
                        router.push(getLocalizedUrl('/notifications', locale))
                      }}
                      className='w-full flex flex-col items-center justify-center'
                    >
                      <Notifications />
                      Notifications
                    </Button>
                  </Box>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  avatar={<i className='tabler-list-details text-xl' />}
                  title='Activity Timeline'
                  titleTypographyProps={{ variant: 'h5' }}
                  action={<OptionMenu options={['Share timeline', 'Suggest edits', 'Report bug']} />}
                  sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
                />
                <CardContent className='flex flex-col gap-6 pbe-5'>
                  <Timeline>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color='primary' />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                          <Typography className='font-medium' color='text.primary'>
                            12 Invoices have been paid
                          </Typography>
                          <Typography variant='caption'>12 min ago</Typography>
                        </div>
                        <Typography className='mbe-2'>Invoices have been paid to the company</Typography>
                        <div className='flex items-center gap-2.5 is-fit rounded bg-actionHover plb-[5px] pli-2.5'>
                          <img height={20} alt='invoice.pdf' src='/images/icons/pdf-document.png' />
                          <Typography className='font-medium'>invoices.pdf</Typography>
                        </div>
                      </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color='success' />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                          <Typography className='font-medium' color='text.primary'>
                            Client Meeting
                          </Typography>
                          <Typography variant='caption'>45 min ago</Typography>
                        </div>
                        <Typography className='mbe-2'>Project meeting with john @10:15am</Typography>
                        <div className='flex items-center gap-2.5'>
                          <Avatar src='/images/avatars/1.png' className='is-8 bs-8' />
                          <div className='flex flex-col flex-wrap'>
                            <Typography variant='body2' className='font-medium'>
                              Lester McCarthy (Client)
                            </Typography>
                            <Typography variant='body2'>CEO of Pixinvent</Typography>
                          </div>
                        </div>
                      </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color='info' />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                          <Typography className='font-medium' color='text.primary'>
                            Create a new project for client
                          </Typography>
                          <Typography variant='caption'>2 Day Ago</Typography>
                        </div>
                        <Typography className='mbe-2'>6 team members in a project</Typography>
                        <AvatarGroup total={6} className='pull-up'>
                          <Avatar alt='Travis Howard' src='/images/avatars/1.png' />
                          <Avatar alt='Agnes Walker' src='/images/avatars/4.png' />
                          <Avatar alt='John Doe' src='/images/avatars/2.png' />
                        </AvatarGroup>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className='p-4 shadow-md'>
                <Typography variant='h6' className='mb-4 flex items-center gap-2'>
                  <i className='tabler-wallet text-[28px]'></i>
                  Order Management
                </Typography>
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-chart-pie-2 text-lg text-orange-500'></i>
                      New Orders
                    </Typography>
                    <Typography variant='h4'>{orders.newOrders}</Typography>
                  </div>

                  <LinearProgress
                    value={78}
                    variant='determinate'
                    color='primary'
                    className='w-1/4 h-2 rounded-full'
                    sx={{ height: 12, borderRadius: 3 }}
                  />
                </div>

                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-hourglass text-[22px] text-yellow-500'></i>
                      Pending Orders
                    </Typography>
                    <Typography variant='h4'>{orders.pendingOrders}</Typography>
                  </div>

                  <LinearProgress
                    value={78}
                    variant='determinate'
                    color='primary'
                    className='w-1/2 h-2 rounded-full'
                    sx={{ height: 12, borderRadius: 3 }}
                  />
                </div>

                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-check text-[22px] text-blue-500'></i>
                      Fulfilled Orders
                    </Typography>
                    <Typography variant='h4'>{orders.fulfilledOrders}</Typography>
                  </div>

                  <LinearProgress
                    value={78}
                    variant='determinate'
                    color='primary'
                    className='w-3/4 h-2 rounded-full'
                    sx={{ height: 12, borderRadius: 3 }}
                  />
                </div>
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-alert-circle text-red-500'></i>
                      Failed Orders
                    </Typography>
                    <Typography variant='h4'>{orders.failedOrders}</Typography>
                  </div>

                  <LinearProgress
                    value={28}
                    variant='determinate'
                    color='primary'
                    className='w-3/4 h-2 rounded-full'
                    sx={{ height: 12, borderRadius: 3 }}
                  />
                </div>
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-rotate text-blue-500'></i>
                      Return Orders
                    </Typography>
                    <Typography variant='h4'> {orders.returnOrders}</Typography>
                  </div>

                  <LinearProgress
                    value={15}
                    variant='determinate'
                    color='primary'
                    className='w-3/4 h-2 rounded-full'
                    sx={{ height: 12, borderRadius: 3 }}
                  />
                </div>
                <div className='flex justify-between items-center mb-1'>
                  <Typography variant='body1' className='flex items-center gap-2'>
                    Total Orders
                  </Typography>

                  <Typography variant='h4'>45</Typography>
                </div>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Card>
    </>
  )
}

export default HomeDesign
