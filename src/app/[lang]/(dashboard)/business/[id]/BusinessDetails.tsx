// MUI Imports
'use client'

import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { BusinessTypeForFile } from '@/api/interface/businessInterface'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useState } from 'react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewBusinessProps = {
  businessItemData: BusinessTypeForFile
}

const BusinessDetails = ({ businessItemData }: PreviewBusinessProps) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/business', locale as Locale))
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
          Business Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Name'
                fullWidth
                defaultValue={businessItemData?.name || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Meta Id'
                fullWidth
                defaultValue={businessItemData?.business_id || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Initial'
                fullWidth
                defaultValue={businessItemData?.business_initial || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid> */}
            <Grid item xs={12}>
              <CustomTextField
                label='Description'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.business_desc || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Currency'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.currency?.label || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Type'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.business_type || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Address'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.business_address || ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Contact number'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.contact_number || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Document'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={businessItemData?.business_doc || ''}
              />
            </Grid>
            {businessItemData?.logo && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Business Logo'
                  InputProps={{ readOnly: true }}
                  fullWidth
                  defaultValue={businessItemData?.logo || ''}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BusinessDetails
