// MUI Imports
'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { InstagramDataType } from '@/api/interface/instagramInterface'
import { getInstgramById } from '@/api/instagram'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewInstagramProps = {
  id: string
}

// MenuDataType
const InstagramDetails = ({ id }: PreviewInstagramProps) => {
  const [instagramItemData, setInstagramItemData] = useState<InstagramDataType | null>(null)
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/platforms', locale as Locale))
  }

  useEffect(() => {
    const fetchInstaGram = async () => {
      try {
        const response = await getInstgramById(Number(id))

        setInstagramItemData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchInstaGram()
  }, [id])

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          Instagram Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Instagram ID'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.instagram_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Account ID'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.account_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Feed to gpt'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.feed_to_gpt}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Access Token'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.access_token}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Account ID'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.account_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={instagramItemData && instagramItemData?.active ? 'active' : ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InstagramDetails
