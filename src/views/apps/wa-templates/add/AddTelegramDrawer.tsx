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
import { TeleGram } from '@/api/telegram'
import { TelegramDataType } from '@/api/interface/telegramInterface'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const AddTelegramDrawer = ({ open, handleClose, businesses, feedToChatGpt }: Props) => {
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
  } = useForm<TelegramDataType>({
    defaultValues: {
      business: undefined,
      name: '',
      username: '',
      feed_to_gpt: undefined,
      active: false
    }
  })

  const onSubmit = (data: TelegramDataType, e: any) => {
    e.preventDefault()

    if (!isActive) {
      setError('active', { type: 'manual', message: 'Active must be checked' })
      return
    }
    setLoading(true)

    const payload = { ...data, active: isActive }

    TeleGram(payload)
      .then(res => {
        toast.success('Telegram created successfully')
        handleClose()

        // router.replace(getLocalizedUrl('/account-settings', locale as Locale))
        router.replace(getLocalizedUrl('/platforms', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in Telegram')
      })
      .finally(() => {
        setLoading(false)
        reset({
          business: undefined,
          name: '',
          username: '',
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
        <Typography variant='h5'>Add Telegram Feed</Typography>
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
                    error={!!errors.business}
                    helperText={errors.business?.message}
                    {...register('business', { required: 'Business is required' })}
                    InputLabelProps={{
                      className: errors.business ? 'requiredFieldError' : undefined
                    }}
                    inputProps={{
                      placeholder: 'Business'
                    }}
                  >
                    {businesses?.map(business => (
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
                    id='feed_to_gpt'
                    label='Feed to gpt *'
                    error={!!errors.feed_to_gpt}
                    helperText={errors.feed_to_gpt?.message}
                    {...register('feed_to_gpt', { required: 'Feed to gpt is required' })}
                    InputLabelProps={{
                      className: errors.feed_to_gpt ? 'requiredFieldError' : undefined
                    }}
                    inputProps={{
                      placeholder: 'Feed to gpt'
                    }}
                  >
                    {feedToChatGpt?.map(feed => (
                      <MenuItem key={feed.id} value={feed.id}>
                        {feed.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Name *'
                    fullWidth
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputLabelProps={{
                      className: errors.name && 'requiredFieldError'
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='User Name *'
                    fullWidth
                    {...register('username', { required: 'User Name is required' })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputLabelProps={{
                      className: errors.username && 'requiredFieldError'
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

export default AddTelegramDrawer
