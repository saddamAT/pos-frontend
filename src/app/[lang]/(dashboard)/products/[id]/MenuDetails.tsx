// MUI Imports
'use client'

import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { getMenuById } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type PreviewMenuProps = {
  id: string
}

const MenuDetails = ({ id }: PreviewMenuProps) => {
  const [menuItemData, setMenuItemData] = useState<MenuDataType | null>(null)
  const { lang: locale } = useParams() as { lang: Locale }
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/products', locale as Locale))
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenuById(Number(id))

        setMenuItemData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchMenu()
  }, [id])

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-11 sm:pbe-4 sm:pli-11'>
          Product Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Title'
                fullWidth
                defaultValue={menuItemData && menuItemData?.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business ID'
                fullWidth
                defaultValue={menuItemData && menuItemData.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Description'
                fullWidth
                defaultValue={menuItemData && menuItemData.description}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Brand'
                fullWidth
                defaultValue={menuItemData && menuItemData.brand}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Availability'
                fullWidth
                defaultValue={menuItemData && menuItemData?.availability}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Status'
                fullWidth
                defaultValue={menuItemData && menuItemData.status}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Price'
                fullWidth
                defaultValue={menuItemData && menuItemData?.price}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='SKU'
                fullWidth
                defaultValue={menuItemData && menuItemData.sku}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MenuDetails
