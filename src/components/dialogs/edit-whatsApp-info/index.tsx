'use client'

// React Imports
import { useState } from 'react'
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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { FeedWhatsApp, updateWhatsApp } from '@/api/whatsapp'
import toast from 'react-hot-toast'
import { BusinessType } from '@/api/interface/businessInterface'
import ConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { ListItemText } from '@mui/material'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useAuthStore } from '@/store/authStore'

type EditWhatsAppInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: WhatsAppDataType
  onTypeAdded?: any
  mode?: string
  feedToChatGpt: FeedToChatGptFileType[]
}

const EditWhatsAppInfo = ({ open, setOpen, data, onTypeAdded, mode, feedToChatGpt }: EditWhatsAppInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<WhatsAppDataType>()

  const [payloadData, setPayloadData] = useState<WhatsAppDataType | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const { businessData } = useAuthStore()

  const handleClose = () => {
    setOpen(false)
    setIsActive(false)
  }

  const onSubmit = (data1: WhatsAppDataType, e: any) => {
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

      const payload = { ...data1, active: isActive }

      FeedWhatsApp(payload)
        .then(res => {
          toast.success('WhatsApp data created successfully')
          onTypeAdded?.()
          handleClose()
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
  }

  const handleConfirm = async () => {
    if (!payloadData) return

    try {
      setLoading(true)
      await updateWhatsApp(payloadData.id, payloadData)
      toast.success('Whats App Feed Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      console.log(error, 'error')
      if (error?.data?.detail) {
        toast.error(error?.data?.detail, {
          duration: 5000
        })
      } else if (error?.data?.business) {
        toast.error(error?.data?.business[0], {
          duration: 5000
        })
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0], {
          duration: 5000
        })
      } else {
        toast.error('Error In Updating WhatsApp Feed', {
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit'
          ? 'Edit whatsApp Information'
          : mode === 'add'
            ? 'Add whatsApp Information'
            : 'WhatsApp Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating whatsApp details will receive a privacy audit'}
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
                label='Select Business'
                defaultValue={data?.business || ''}
                {...register('business', { required: 'Business is required' })}
                inputProps={{
                  readOnly: mode === 'view'
                }}
                error={!!errors.business}
                helperText={errors.business?.message}
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
                select
                fullWidth
                id='Feed to gpt'
                label='Feed to gpt'
                defaultValue={data?.feed_to_gpt || ''}
                inputProps={{ placeholder: 'feed_to_gpt', readOnly: mode === 'view' }}
                {...register('feed_to_gpt', { required: 'Feed to gpt is required' })}
                error={!!errors.feed_to_gpt}
                helperText={errors.feed_to_gpt?.message}
                InputLabelProps={{
                  className: errors.feed_to_gpt ? 'requiredFieldError' : undefined
                }}
              >
                {feedToChatGpt?.length > 0 ? (
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
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Phone Id'
                defaultValue={data?.phone_id || ''}
                {...register('phone_id', {
                  required: 'Phone Id is required'
                })}
                error={!!errors.phone_id}
                helperText={errors.phone_id?.message}
                InputLabelProps={{
                  className: errors.phone_id ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Access Token'
                {...register('access_token', { required: 'Access Token is required' })}
                defaultValue={data?.access_token || ''}
                {...register('access_token', {
                  required: 'Access Token is required'
                })}
                error={!!errors.access_token}
                helperText={errors.access_token?.message}
                InputLabelProps={{
                  className: errors.access_token ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='WhatsApp Account Id'
                {...register('whatsapp_account_id', { required: 'WhatsApp Account Id is required' })}
                defaultValue={data?.whatsapp_account_id || ''}
                error={!!errors.whatsapp_account_id}
                helperText={errors.whatsapp_account_id?.message}
                InputLabelProps={{
                  className: errors.whatsapp_account_id ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Catalog Id'
                defaultValue={data?.catalog_id || ''}
                {...register('catalog_id', {
                  required: 'Catalog Id is required'
                })}
                error={!!errors.catalog_id}
                helperText={errors.catalog_id?.message}
                InputLabelProps={{
                  className: errors.catalog_id ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Web Hook Token'
                defaultValue={data?.webhook_token || ''}
                inputProps={{
                  readOnly: mode === 'view'
                }}
                {...register('webhook_token', {
                  required: 'Web Hook Token is required'
                })}
                error={!!errors.webhook_token}
                helperText={errors.webhook_token?.message}
                InputLabelProps={{
                  className: errors.webhook_token ? 'requiredFieldError' : undefined
                }}
              />
            </Grid>
            {mode !== 'add' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
                  {...register('active', { required: 'Status is required' })}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                  error={!!errors.active}
                  helperText={errors.active?.message}
                >
                  <MenuItem value='' disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            )}

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
          title='Edit WhatsApp Feed'
          description='Are you sure you want to edit this  WhatsApp Feed?'
        />
      )}
    </Dialog>
  )
}

export default EditWhatsAppInfo
