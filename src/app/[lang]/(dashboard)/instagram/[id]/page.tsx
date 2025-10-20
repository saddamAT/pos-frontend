// MUI Imports
import Grid from '@mui/material/Grid'

import InstagramDetails from './InstagramDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const InstagramPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <InstagramDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default InstagramPreview
