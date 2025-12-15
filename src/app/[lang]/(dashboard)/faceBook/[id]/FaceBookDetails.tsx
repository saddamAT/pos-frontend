// MUI Imports
'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { getFaceBookById } from '@/api/facebook'
import { FaceBookDataType } from '@/api/interface/facebookInterface'
import Loader from '@/components/loader/Loader'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewFaceBookProps = {
  id: string
}

// MenuDataType
const FaceBookDetails = ({ id }: PreviewFaceBookProps) => {
  const [faceBookItemData, setFaceBookItemData] = useState<FaceBookDataType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/platforms', locale as Locale))
  }

  useEffect(() => {
    const fetchFaceBookData = async () => {
      setLoading(true)
      try {
        const response = await getFaceBookById(Number(id))
        setLoading(false)
        setFaceBookItemData(response?.data)
      } catch (error: any) {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    fetchFaceBookData()
  }, [id])

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          FaceBook Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData?.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Facebook ID'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData?.facebook_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Access Token'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData?.access_token}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData.active ? 'active' : ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Web Hook Token'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData?.webhook_token}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Catalog ID'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData?.catalog_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={faceBookItemData && faceBookItemData.active ? 'active' : ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {loading && <Loader />}
    </>
  )
}

export default FaceBookDetails
