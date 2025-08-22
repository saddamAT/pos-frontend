// MUI Imports
'use client'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewResturantDetailsProps = {
  resturantItemData: ResturantDataType
}

// MenuDataType
const ResturantDetails = ({ resturantItemData }: PreviewResturantDetailsProps) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/outlets', locale as Locale))
  }

  return (
    <>
      <Dialog
        // fullWidth
        open={open}
        // maxWidth='md'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          Outlet Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Name'
                fullWidth
                defaultValue={resturantItemData && resturantItemData?.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business ID'
                fullWidth
                defaultValue={resturantItemData && resturantItemData.business?.business_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Description'
                fullWidth
                defaultValue={resturantItemData && resturantItemData.description}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='City'
                fullWidth
                defaultValue={resturantItemData && resturantItemData?.city}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Catalog Link'
                fullWidth
                defaultValue={resturantItemData && resturantItemData?.catalog_link}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Postal Code'
                fullWidth
                defaultValue={resturantItemData && resturantItemData?.postal_code_delivery}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Cuisine Type'
                fullWidth
                defaultValue={resturantItemData && resturantItemData?.cuisine_type}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Contact Number'
                fullWidth
                defaultValue={resturantItemData && resturantItemData.contact_number}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ResturantDetails
