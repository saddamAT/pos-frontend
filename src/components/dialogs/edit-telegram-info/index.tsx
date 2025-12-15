'use client'
// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { TelegramDataType } from '@/api/interface/telegramInterface'
import { TeleGram, updateTelegram } from '@/api/telegram'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { BusinessType } from '@/api/interface/businessInterface'
import ConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { ListItemText } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useAuthStore } from '@/store/authStore'

type EditTelegramInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: TelegramDataType
  onTypeAdded?: any
  mode: 'add' | 'edit' | 'view'
  feedToChatGpt: FeedToChatGptFileType[]
}

const EditTelegramInfo = ({ open, setOpen, data, onTypeAdded, mode, feedToChatGpt }: EditTelegramInfoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<TelegramDataType>()

  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<TelegramDataType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()
  const { businessData } = useAuthStore()

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && data) {
      reset(data)
    } else {
      reset()
    }
  }, [mode, data, reset, created, updated])

  const handleClose = () => {
    setOpen(false)
    reset()
    setIsActive(false)
    clearErrors()
  }

  const onSubmit = (data1: TelegramDataType, e: any) => {
    e.preventDefault()

    if (mode === 'edit' && data) {
      setPayloadData({ ...data1, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    } else {
      if (!isActive) {
        setError('active', { type: 'manual', message: 'Active must be checked' })
        return
      }
      setLoading(true)
      setCreated(false)

      const payload = { ...data1, active: isActive }

      TeleGram(payload)
        .then(res => {
          toast.success('Telegram created successfully')
          onTypeAdded?.()
          setCreated(true)
          handleClose()
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
  }
  const handleConfirm = async () => {
    if (!payloadData) return
    setUpdated(false)
    try {
      setLoading(true)
      await updateTelegram(payloadData.id, payloadData)
      toast.success('Telegram Data Updated Successfully')
      setUpdated(true)
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      // console.log(error, 'error')
      if (error?.data?.detail) {
        toast.error(error?.data?.detail)
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0])
      } else {
        toast.error('Error In Updating Telegram')
      }
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog fullWidth open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit'
          ? 'Edit Telegram Information'
          : mode === 'add'
            ? 'Add Telegram Information'
            : 'Telegram Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating Telegram details will receive a privacy audit'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Business'
                defaultValue={data?.business || ''}
                {...register('business', {
                  required: 'Business is required' // Add validation here
                })}
                error={!!errors.business} // Check if there's an error for the business field
                helperText={errors.business?.message} // Display the error message for the business field
                InputLabelProps={{
                  className: errors.business ? 'requiredFieldError' : undefined
                }}
              >
                {businessData && businessData.length > 0 ? (
                  businessData.map((business: BusinessType) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value=''>
                    <ListItemText primary='No business found' />
                  </MenuItem>
                )}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Name'
                defaultValue={data?.name || ''}
                {...register('name', {
                  required: 'name is required'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{
                  className: errors.name ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='User Name'
                {...register('username', { required: 'User name is required' })}
                defaultValue={data?.username || ''}
                {...register('username', {
                  required: 'User name is required'
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputLabelProps={{
                  className: errors.username ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='Feed to gpt'
                label='Feed to gpt'
                defaultValue={data?.feed_to_gpt || ''}
                inputProps={{ placeholder: 'feed_to_gpt', readOnly: mode === 'view' }}
                {...register('feed_to_gpt', { required: 'Feed to gpt is required' })}
                error={!!errors.feed_to_gpt}
                helperText={errors.feed_to_gpt?.message}
              >
                {feedToChatGpt.length > 0 ? (
                  feedToChatGpt.map(feed => (
                    <MenuItem key={feed.id} value={feed.id}>
                      {feed.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <ListItemText primary='No Feed to gpt available' />
                  </MenuItem>
                )}
              </CustomTextField>
            </Grid>
            {/* 
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
                {...register('active', { required: 'Status is required' })}
                error={!!errors.active}
                helperText={errors.active?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              >
                <MenuItem value='' disabled>
                  Select Status
                </MenuItem>
                <MenuItem value='true'>Active</MenuItem>
                <MenuItem value='false'>Inactive</MenuItem>
              </CustomTextField>
            </Grid> */}
            {mode === 'add' && (
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
            )}
            {mode !== 'add' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
                  {...register('active', { required: 'Status is required' })}
                  error={!!errors.active}
                  helperText={errors.active?.message}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                >
                  <MenuItem value='' disabled>
                    Status
                  </MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          {(mode === 'edit' || mode === 'add') && (
            <Button variant='contained' type='submit'>
              Submit
            </Button>
          )}
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
      {mode === 'edit' && (
        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title='Edit Telegram'
          description='Are you sure you want to edit this Telegram?'
        />
      )}
    </Dialog>
  )
}

export default EditTelegramInfo
