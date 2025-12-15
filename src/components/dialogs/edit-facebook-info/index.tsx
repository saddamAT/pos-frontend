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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { FaceBookDataType } from '@/api/interface/facebookInterface'
import { FaceBook, updateFaceBook } from '@/api/facebook'
import toast from 'react-hot-toast'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
import { ListItemText } from '@mui/material'
import { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'
import { useParams, useRouter } from 'next/navigation'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useAuthStore } from '@/store/authStore'

type EditFaceBookInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: FaceBookDataType
  onTypeAdded?: any
  mode?: string
  feedToChatGpt: FeedToChatGptFileType[]
}

const EditFaceBookInfo = ({ open, setOpen, data, onTypeAdded, mode, feedToChatGpt }: EditFaceBookInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<FaceBookDataType | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const { businessData } = useAuthStore()

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

  const handleClose = () => {
    setOpen(false)
    setIsActive(false)
    clearErrors()
  }

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && data) {
      reset(data)
    } else {
      reset()
    }
  }, [mode, data, reset, created, updated])

  const onSubmit = (data1: FaceBookDataType, e: any) => {
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

      FaceBook(payload)
        .then(res => {
          toast.success('FaceBook created successfully')
          setCreated(true)
          onTypeAdded?.()
          handleClose()
          router.replace(getLocalizedUrl('/platforms', locale as Locale))
        })
        .catch(error => {
          if (error?.data?.business) {
            toast.error(error?.data?.business[0])
          } else if (error?.data?.feed_to_gpt) {
            toast.error(error?.data?.feed_to_gpt[0])
          } else {
            toast.error('Something went wrong while creating facebook feed')
          }
          console.log(error, 'error in Facebook')
        })
        .finally(() => {
          setLoading(false)
          reset() // Reset the form after submission
          setIsActive(false)
        })
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)
      setUpdated(false)
      await updateFaceBook(payloadData.id, payloadData)
      toast.success('Facebook Updated Successfully')
      setUpdated(true)
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      if (error?.data?.detail) {
        toast.error(error?.data?.detail, {
          duration: 5000
        })
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0], {
          duration: 5000
        })
      } else {
        toast.error('Error In Updating Facebook Feed', {
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
          ? 'Edit facebook Information'
          : mode === 'add'
            ? 'Add facebook Information'
            : 'Facebook Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating facebook details will receive a privacy audit'}
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
                select
                fullWidth
                id='feed_to_gpt'
                label='Feed to gpt'
                defaultValue={data?.feed_to_gpt || ''}
                inputProps={{ placeholder: 'feed to gpt', readOnly: mode === 'view' }}
                {...register('feed_to_gpt', {
                  required: 'Feed to gpt is required'
                })}
                error={!!errors.feed_to_gpt}
                helperText={errors.feed_to_gpt?.message}
                InputLabelProps={{
                  className: errors.feed_to_gpt ? 'requiredFieldError' : undefined
                }}
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

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Access Token'
                defaultValue={data?.access_token || ''}
                {...register('access_token', { required: 'Access Token is required' })}
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
                label='Facebook account id'
                type='number' // Set the input type to 'number'
                defaultValue={data?.facebook_account_id || ''}
                {...register('facebook_account_id', {
                  required: 'Facebook account id is required'
                })}
                error={!!errors.facebook_account_id}
                helperText={errors.facebook_account_id?.message}
                InputLabelProps={{
                  className: errors.facebook_account_id ? 'requiredFieldError' : undefined
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
                {...register('catalog_id', { required: 'Catalog ID is required' })}
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
                {...register('webhook_token', { required: 'Webhook Token is required' })}
                error={!!errors.webhook_token}
                helperText={errors.webhook_token?.message}
                InputLabelProps={{
                  className: errors.webhook_token ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
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
        <UpdateConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title='Edit Facebook'
          description='Are you sure you want to edit this Facebook?'
        />
      )}
    </Dialog>
  )
}

export default EditFaceBookInfo
