// MUI Imports
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { type Locale } from '@/configs/i18n'
import Grid from '@mui/material/Grid'
import DistributedBarChartOrder from '@/components/home/crm/DistributedBarChartOrder'
import LineAreaYearlySalesChart from '@/components/home/crm/LineAreaYearlySalesChart'
import CardStatsVertical from '@/components/card-statistics/Vertical'
import BarChartRevenueGrowth from '@/components/home/crm/BarChartRevenueGrowth'
import EarningReportsWithTabs from '@/components/home/crm/EarningReportsWithTabs'
import RadarSalesChart from '@/components/home/crm/RadarSalesChart'
import ActivityTimeline from '@/components/home/crm/ActivityTimeline'
import LastTransaction from '@/components/home/crm/LastTransaction'
import { getServerMode } from '@/@core/utils/serverHelpers'
import HomeDesign from '@/components/home/home-design/HomeDesign'

type Props = {
  params: { lang: Locale }
}

const HomePage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  const serverMode = getServerMode()

  if (!session?.accessToken) {
    redirect(`/${params.lang}/login`)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <HomeDesign />
      </Grid>
      <Grid item xs={12} lg={8}>
        <EarningReportsWithTabs />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <RadarSalesChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <LastTransaction serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ActivityTimeline />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DistributedBarChartOrder />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <LineAreaYearlySalesChart />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <CardStatsVertical
          title='Total Profit'
          subtitle='Last Week'
          stats='1.28k'
          avatarColor='error'
          avatarIcon='tabler-credit-card'
          avatarSkin='light'
          avatarSize={44}
          chipText='-12.2%'
          chipColor='error'
          chipVariant='tonal'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <CardStatsVertical
          title='Total Sales'
          subtitle='Last Week'
          stats='24.67k'
          avatarColor='success'
          avatarIcon='tabler-currency-dollar'
          avatarSkin='light'
          avatarSize={44}
          chipText='+24.67%'
          chipColor='success'
          chipVariant='tonal'
        />
      </Grid>
      <Grid item xs={12} md={8} lg={4}>
        <BarChartRevenueGrowth />
      </Grid>
    </Grid>
  )
}

export default HomePage
