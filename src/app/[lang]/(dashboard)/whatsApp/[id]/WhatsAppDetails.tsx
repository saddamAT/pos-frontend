// MUI Imports
'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewWhatsAppProps = {
  whatsAppItemData: WhatsAppDataType | null
}

// MenuDataType
const WhatsAppDetails = ({ whatsAppItemData }: PreviewWhatsAppProps) => {
  console.log(whatsAppItemData, 'whatsAppItemData')

  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/platforms', locale as Locale))
  }

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          WhatsApp Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Phone ID'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.phone_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label='Access Token'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.access_token}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.active ? 'active' : ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Web Hook Token'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.webhook_token}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='WhatsApp Account ID'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.whatsapp_account_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Catalog ID'
                fullWidth
                defaultValue={whatsAppItemData && whatsAppItemData?.catalog_id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WhatsAppDetails
