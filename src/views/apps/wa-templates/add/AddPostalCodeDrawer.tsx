// React Imports
import { useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
// MUI Imports

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { InputAdornment, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Loader from '@/components/loader/Loader'
import { CreateFeedToGPT } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { FeedPostalCodes } from '@/api/postalCodes'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
}

const AddPostalCodeDrawer = ({ open, handleClose, businesses }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<postalCodesDataType>()

  const onSubmit = (data: postalCodesDataType, e: any) => {
    e.preventDefault()
    setLoading(true)

    FeedPostalCodes(data)
      .then(res => {
        toast.success('Postal Code added successfully')
        handleClose()
        // router.replace(getLocalizedUrl('/home', locale as Locale))
        router.replace(getLocalizedUrl('/postal-code', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in FeedPostalCodes')
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    handleClose()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'> Postal Codes</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Business *'
                    {...register('business', {
                      required: 'Business is required'
                    })}
                    error={!!errors.business}
                    helperText={errors.business?.message}
                    InputLabelProps={{
                      className: errors.business ? 'requiredFieldError' : undefined
                    }}
                  >
                    {businesses &&
                      businesses?.map(business => (
                        <MenuItem key={business.id} value={business.id}>
                          {business.business_id}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    label='City'
                    fullWidth
                    placeholder='Enter City'
                    {...register('city', { required: 'City is required' })}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    label='Codes'
                    fullWidth
                    placeholder='Enter Code'
                    {...register('code', { required: 'Code is required' })}
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                </Grid>
              </Grid>

              <div className='flex items-center gap-4'>
                <Button type='submit' variant='contained' color='primary' disabled={loading}>
                  {/* {loading ? 'Saving...' : 'Save Changes'} */}
                  Submit
                </Button>
                <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                  Cancel
                </Button>
              </div>
              {loading && <Loader />}
            </CardContent>
          </Card>
        </form>
      </div>
    </Drawer>
  )
}

export default AddPostalCodeDrawer
