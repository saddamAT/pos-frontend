// MUI Imports
'use client'
import { useState } from 'react'

import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { SizeDataType } from '@/api/interface/sizeInterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type SizeDetailsProps = {
  menuSizeItemData: SizeDataType | null
}

const SizeDetails = ({ menuSizeItemData }: SizeDetailsProps) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/products', locale as Locale))
  }

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-12 sm:pbe-4 sm:pli-12'>
          Size Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Size'
                fullWidth
                defaultValue={menuSizeItemData && menuSizeItemData?.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Product'
                fullWidth
                defaultValue={menuSizeItemData && menuSizeItemData?.menu?.title}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label='Description'
                fullWidth
                defaultValue={menuSizeItemData && menuSizeItemData?.description}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={menuSizeItemData && menuSizeItemData?.active ? 'Active' : 'InActive'}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Additional Price'
                fullWidth
                defaultValue={menuSizeItemData && menuSizeItemData?.additional_price}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SizeDetails
