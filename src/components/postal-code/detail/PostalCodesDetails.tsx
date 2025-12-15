// MUI Imports
'use client'
import Grid from '@mui/material/Grid'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { getPostalCodeById } from '@/api/postalCodes'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type PostalCodesDetailsProps = {
  id: string
}

// MenuDataType
const PostalCodesDetails = ({ id }: PostalCodesDetailsProps) => {
  const [postalCodeItemData, setPostalCodesItemData] = useState<postalCodesDataType | null>(null)
  const [open, setOpen] = useState(true)
  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()

  useEffect(() => {
    const fetchPostalCode = async () => {
      try {
        const response = await getPostalCodeById(Number(id))
        // console.log(response?.data, 'response Of Single getPostalCodeById------')
        setPostalCodesItemData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchPostalCode()
  }, [id])

  const handleClose = () => {
    setOpen(false)
    router.push(getLocalizedUrl('/postal-code', locale as Locale))
  }

  return (
    <>
      <Dialog open={open} scroll='body' onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center'>
          Postal Codes Details
        </DialogTitle>

        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business'
                fullWidth
                defaultValue={postalCodeItemData && postalCodeItemData?.business}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='City'
                InputProps={{ readOnly: true }}
                fullWidth
                defaultValue={postalCodeItemData && postalCodeItemData?.city}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label='Code'
                fullWidth
                defaultValue={postalCodeItemData && postalCodeItemData?.code}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostalCodesDetails
