// MUI Imports
'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { ToppingDataTypeWithObjects } from '@/api/interface/toppingInterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type ToppingDetailsProps = {
  toppingItemData: ToppingDataTypeWithObjects | null
}

// MenuDataType
const ToppingDetails = ({ toppingItemData }: ToppingDetailsProps) => {
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
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          Topping Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Name'
                fullWidth
                defaultValue={toppingItemData && toppingItemData?.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business ID'
                fullWidth
                defaultValue={toppingItemData && toppingItemData?.business?.id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Description'
                fullWidth
                defaultValue={toppingItemData && toppingItemData?.description}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Food Type'
                fullWidth
                defaultValue={toppingItemData && toppingItemData?.type?.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Additional Price'
                fullWidth
                defaultValue={toppingItemData && toppingItemData?.additional_price}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ToppingDetails
