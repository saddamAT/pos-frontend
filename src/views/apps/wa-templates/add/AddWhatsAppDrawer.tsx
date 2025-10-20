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
import { ListItemText, MenuItem } from '@mui/material'
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
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { FeedWhatsApp } from '@/api/whatsapp'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const AddWhatsAppDrawer = ({ open, handleClose, businesses, feedToChatGpt }: Props) => {
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
  } = useForm<WhatsAppDataType>({
    defaultValues: {
      business: undefined,
      access_token: '',
      webhook_token: '',
      feed_to_gpt: undefined,
      active: false
    }
  })

  const onSubmit = (data: WhatsAppDataType, e: any) => {
    e.preventDefault()

    if (!isActive) {
      setError('active', { type: 'manual', message: 'Active must be checked' })
      return
    }
    setLoading(true)

    const payload = { ...data, active: isActive }

    FeedWhatsApp(payload)
      .then(res => {
        toast.success('WhatsApp data created successfully')
        handleClose()
        // router.replace(getLocalizedUrl('/account-settings', locale as Locale))
        router.replace(getLocalizedUrl('/platforms', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error')
        if (error?.data?.webhook_token) {
          toast.error(error?.data?.webhook_token[0])
        } else if (error?.data && error?.data?.feed_to_gpt) {
          toast.error(error?.data?.feed_to_gpt[0])
        } else {
          toast.error('error in Feed WhatsApp')
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
        reset({
          business: undefined,
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
        <Typography variant='h5'>Add WhatssApp Feed</Typography>
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
                    {businesses.length > 0 ? (
                      businesses.map(business => (
                        <MenuItem key={business.id} value={business.id}>
                          {business.business_id}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary='No business found' />
                      </MenuItem>
                    )}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='feed_to_gpt'
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
                    label='Phone id *'
                    fullWidth
                    placeholder='Enter Phone id'
                    {...register('phone_id', { required: 'Phone id is required' })}
                    error={!!errors.phone_id}
                    helperText={errors.phone_id?.message}
                    InputLabelProps={{
                      className: errors.phone_id ? 'requiredFieldError' : undefined
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
                    label='WhatsApp Account ID *'
                    fullWidth
                    type='number'
                    {...register('whatsapp_account_id', {
                      required: 'WhatsApp Account ID is required',
                      valueAsNumber: true
                    })}
                    error={!!errors.whatsapp_account_id}
                    helperText={errors.whatsapp_account_id?.message}
                    InputLabelProps={{
                      className: errors.whatsapp_account_id ? 'requiredFieldError' : undefined
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

export default AddWhatsAppDrawer
