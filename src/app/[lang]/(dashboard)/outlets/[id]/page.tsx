// MUI Imports
import Grid from '@mui/material/Grid'
import ResturantDetails from './ResturantDetails'
import { getRestaurantById } from '@/api/resturant'
import { ResturantDataType } from '@/api/interface/resturantInterface'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ResturantPreview = async ({ params }: PageProps) => {
  const response = await getRestaurantById(Number(params.id))
  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <ResturantDetails resturantItemData={response.data as ResturantDataType} />
      </Grid>
    </Grid>
  )
}

export default ResturantPreview
