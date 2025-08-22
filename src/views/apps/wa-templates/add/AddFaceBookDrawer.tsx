// React Imports
import { useEffect, useState } from 'react'
// MUI Imports
import { useParams, useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Loader from '@/components/loader/Loader'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { FaceBookDataType } from '@/api/interface/facebookInterface'
import { FaceBook } from '@/api/facebook'
import { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const AddFaceBookDrawer = ({ open, handleClose, businesses, feedToChatGpt }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const [isActive, setIsActive] = useState<boolean>(false)

  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<FaceBookDataType>({
    defaultValues: {
      business: 0,
      facebook_id: '',
      access_token: '',
      webhook_token: '',
      facebook_account_id: 0,
      catalog_id: '',
      feed_to_gpt: 0,
      active: false
    }
  })

  const onSubmit = (data: FaceBookDataType, e: any) => {
    e.preventDefault()
    if (!isActive) {
      setError('active', { type: 'manual', message: 'Active must be checked' })
      return
    }
    setLoading(true)

    const payload = { ...data, active: isActive }

    FaceBook(payload)
      .then(res => {
        toast.success('FaceBook created successfully')
        handleClose()

        // router.replace(getLocalizedUrl('/account-settings', locale as Locale))
        router.replace(getLocalizedUrl('/platforms', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in FeedWhatsApp')
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
        setIsActive(false)
      })
  }
  const handleReset = () => {
    handleClose()
    reset()
    setIsActive(false)
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
        <Typography variant='h5'>Add FaceBook Feed</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='Feed to gpt'
                    label='Feed to gpt *'
                    {...register('feed_to_gpt', {
                      required: 'Feed to gpt is required'
                    })}
                    error={!!errors.feed_to_gpt}
                    helperText={errors.feed_to_gpt?.message}
                    InputLabelProps={{
                      className: errors.feed_to_gpt ? 'requiredFieldError' : undefined
                    }}
                  >
                    {feedToChatGpt &&
                      feedToChatGpt?.map(feed => (
                        <MenuItem key={feed.id} value={feed.id}>
                          {feed.name}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Facebook id *'
                    fullWidth
                    placeholder='Enter Facebook id'
                    {...register('facebook_id', { required: 'Facebook id is required' })}
                    error={!!errors.facebook_id}
                    helperText={errors.facebook_id?.message}
                    InputLabelProps={{
                      className: errors.facebook_id ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                {/*  */}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Access Token *'
                    fullWidth
                    placeholder='Enter Access Token'
                    {...register('access_token', { required: 'Access Token is required' })}
                    error={!!errors.access_token}
                    helperText={errors.access_token?.message}
                    InputLabelProps={{
                      className: errors.access_token ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Webhook Token *'
                    fullWidth
                    {...register('webhook_token', { required: 'Webhook Token is required' })}
                    error={!!errors.webhook_token}
                    helperText={errors.webhook_token?.message}
                    InputLabelProps={{
                      className: errors.webhook_token ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Facebook account id *'
                    fullWidth
                    type='number' // Set the input type to 'number'
                    {...register('facebook_account_id', {
                      required: 'Facebook account id is required'
                    })}
                    error={!!errors.facebook_account_id}
                    helperText={errors.facebook_account_id?.message}
                    InputLabelProps={{
                      className: errors.facebook_account_id ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Catalog ID *'
                    fullWidth
                    {...register('catalog_id', { required: 'Catalog ID is required' })}
                    error={!!errors.catalog_id}
                    helperText={errors.catalog_id?.message}
                    InputLabelProps={{
                      className: errors.catalog_id ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
                  <FormControl error={!!errors.active}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color='primary'
                          checked={isActive}
                          onChange={e => {
                            const checked = e.target.checked
                            setIsActive(checked)
                            if (!checked) {
                              setError('active', { type: 'manual', message: 'Active must be checked' })
                            } else {
                              clearErrors('active')
                            }
                          }}
                        />
                      }
                      label='Active'
                    />
                    {errors.active && <FormHelperText>{errors.active.message}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>

              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit' disabled={loading}>
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

export default AddFaceBookDrawer
