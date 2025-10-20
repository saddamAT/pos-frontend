// MUI Imports
import Grid from '@mui/material/Grid'
import FeedToGptDetails from './FeedToGptDetails'
import { getFeedToGptById } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const FeedToGptPreview = async ({ params }: PageProps) => {
  const response = await getFeedToGptById(Number(params?.id))
  const feedToGptItemData: FeedToChatGptType | null = response?.data
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <FeedToGptDetails feedToGptItemData={feedToGptItemData} />
      </Grid>
    </Grid>
  )
}

export default FeedToGptPreview
