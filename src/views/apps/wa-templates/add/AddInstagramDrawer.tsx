// React Imports
import { useState } from 'react'
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
import { InstagramDataType } from '@/api/interface/instagramInterface'
import { FeedInstaGram } from '@/api/instagram'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const AddInstagramDrawer = ({ open, handleClose, businesses, feedToChatGpt }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  //testing

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
  } = useForm<InstagramDataType>({
    defaultValues: {
      business: undefined,
      instagram_id: '',
      access_token: '',
      feed_to_gpt: undefined,
      active: false
    }
  })

  const onSubmit = (data: InstagramDataType, e: any) => {
    e.preventDefault()
    if (!isActive) {
      setError('active', { type: 'manual', message: 'Active must be checked' })
      return
    }
    setLoading(true)

    const payload = { ...data, active: isActive }

    FeedInstaGram(payload)
      .then(res => {
        toast.success('InstaGram feed created successfully')
        handleClose()
        // router.replace(getLocalizedUrl('/account-settings', locale as Locale))
        router.replace(getLocalizedUrl('/platforms', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in InstaGram')
      })
      .finally(() => {
        setLoading(false)
        reset()
        reset({
          business: undefined,
          instagram_id: '',
          access_token: '',
          feed_to_gpt: undefined
        })
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
        <Typography variant='h5'>Add Instagram Feed</Typography>
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
                    inputProps={{ placeholder: 'Feed to gpt', ...register('feed_to_gpt') }}
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
                    label='Instagram id *'
                    fullWidth
                    placeholder='Enter Instagram id'
                    {...register('instagram_id', { required: 'Instagram id is required' })}
                    error={!!errors.instagram_id}
                    helperText={errors.instagram_id?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Access Token *'
                    fullWidth
                    placeholder='Enter Access Token'
                    {...register('access_token', { required: 'Access Token is required' })}
                    error={!!errors.access_token}
                    helperText={errors.access_token?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Account Id *'
                    fullWidth
                    {...register('account_id', { required: 'Account Id is required' })}
                    error={!!errors.account_id}
                    helperText={errors.account_id?.message}
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
              {/* {loading && <Loader />} */}
            </CardContent>
          </Card>
        </form>
      </div>
    </Drawer>
  )
}

export default AddInstagramDrawer
