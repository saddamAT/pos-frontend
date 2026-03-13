'use client'
import { useEffect, useMemo, useState } from 'react' // (useState already present)
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
import { getLocalizedUrl } from '@/utils/i18n'
import { useRouter, useSearchParams } from 'next/navigation'
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
import PostLoginModal, { UserBusiness } from '@/components/business/modal/PostLoginModal'

// 🔑 localStorage key for one-time dismissal of post-login modal
const POST_LOGIN_DISMISSED_KEY = 'aimyable:postLoginDismissed'

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
  console.log(data, 'session ---15')

  const branchName = data?.user?.selectedOutlet?.name

  let selectedBusinessName = ''

  const businessLength = data?.user?.userBusinesses

  if (data?.user.userBusinesses && data.user.selectedBusiness?.id) {
    const match = data.user.userBusinesses.find(ub =>
      ub.user_business?.some(b => b.id === data?.user?.selectedBusiness?.id)
    )
    selectedBusinessName = match?.name || selectedBusinessName
  }

  const search = useSearchParams()

  // make sure we have status to know when session is ready
  const { data: session, status } = useSession()

  // businesses for the modal
  const businesses = (session?.user?.userBusinesses ?? []) as UserBusiness[]

  // sensible defaults for the modal pre-selection
  const firstBizWithOutlet = useMemo(
    () => businesses.find(b => (b.user_business?.length ?? 0) > 0) || null,
    [businesses]
  )
  const initialSelected = useMemo(
    () => ({
      businessId: firstBizWithOutlet?.id ?? null,
      outletId: firstBizWithOutlet?.user_business?.[0]?.id ?? null
    }),
    [firstBizWithOutlet]
  )

  const [showPostLogin, setShowPostLogin] = useState(false)

  // force-open flag sent from Login
  const forcePostLoginModal = search.get('postLogin') === '1'

  // ✅ Refined: decide if/when to open the modal
  useEffect(() => {
    if (status !== 'authenticated') return

    // If explicitly redirected with ?postLogin=1, always show once
    if (forcePostLoginModal) {
      try {
        localStorage.removeItem(POST_LOGIN_DISMISSED_KEY)
      } catch {}
      setShowPostLogin(true)
      return
    }

    // If user previously skipped with no selection, don't show again on refresh
    let dismissed = false
    try {
      dismissed = localStorage.getItem(POST_LOGIN_DISMISSED_KEY) === '1'
    } catch {}

    if (dismissed) {
      setShowPostLogin(false)
      return
    }

    // Otherwise, open only when there is no selection yet
    const hasSelection = Boolean(session?.user?.selectedBusiness && session?.user?.selectedOutlet)
    setShowPostLogin(!hasSelection)
  }, [status, session, forcePostLoginModal])

  // helper to clear the query param after closing/confirming
  const clearPostLoginParam = () => {
    router.replace(getLocalizedUrl('/home', locale))
  }

  const handleConfirmSelection = (sel: { businessId: number | null; outletId: number | null }) => {
    // If a valid selection is made, clear any prior dismissal
    try {
      localStorage.removeItem(POST_LOGIN_DISMISSED_KEY)
    } catch {}
    const qp = sel.businessId && sel.outletId ? `?business=${sel.businessId}&outlet=${sel.outletId}` : ''
    router.replace(getLocalizedUrl(`/home${qp}`, locale))
    setShowPostLogin(false)
  }

  return (
    <>
      <Card>
        <div className='p-6'>
          <div className='mb-6'>
            <div className='flex justify-between items-center'>
              <div className='text-2xl font-bold'>Welcome {data?.user?.first_name}!</div>
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
            {businessLength && businessLength?.length > 0 && (
              <Typography className='mt-1 font-normal text-[0.9375rem] leading-[1.46667]'>
                {data?.user?.selectedBusiness && 'You are currently logged in to the'} {''}
                {branchName}
                {''} of {data?.user?.selectedBusiness && selectedBusinessName && 'of '}
                {data?.user?.selectedBusiness?.name}
              </Typography>
            )}
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

      <PostLoginModal
        open={showPostLogin}
        onClose={() => {
          setShowPostLogin(false)
          clearPostLoginParam()
        }}
        onSkip={() => {
          // Mark dismissed so it won't reopen on refresh when no selection exists
          try {
            localStorage.setItem(POST_LOGIN_DISMISSED_KEY, '1')
          } catch {}
          setShowPostLogin(false)
          clearPostLoginParam()
        }}
        businesses={businesses}
        initialSelected={initialSelected}
        onConfirmSelection={handleConfirmSelection}
      />
    </>
  )
}

export default HomeDesign
