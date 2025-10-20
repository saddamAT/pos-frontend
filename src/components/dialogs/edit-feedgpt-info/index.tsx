'use client'
// React Imports
import { useEffect, useRef, useState } from 'react'
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
import toast from 'react-hot-toast'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { CreateFeedToGPT, updateFeedToGPT } from '@/api/feedToChatGPT'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { ListItemText } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

type EditFeedGptInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: FeedToChatGptType
  onTypeAdded?: any
  mode: 'add' | 'edit' | 'view'
}

const EditFeedGptInfo = ({ open, setOpen, data, onTypeAdded, mode }: EditFeedGptInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset
  } = useForm<FeedToChatGptType>()

  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<FeedToChatGptType | null>(null)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const { businessData } = useAuthStore()

  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && data) {
      reset(data)
    } else {
      reset()
    }
  }, [mode, data, reset, created, updated])

  const handleClose = () => {
    reset()
    setOpen(false)
    clearErrors()
  }

  const handleConfirm = async () => {
    setUpdated(false)
    if (!payloadData) return
    try {
      setLoading(true)
      await updateFeedToGPT(payloadData.id, payloadData)
      toast.success('Feed To Chat Gpt Updated Successfully')
      onTypeAdded?.()
      setUpdated(true)
      setOpen(false)
    } catch (error: any) {
      if (error?.data?.detail) {
        toast.error(error?.data?.detail)
      } else if (error?.data?.business) {
        toast.error(error?.data?.business[0])
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0])
      }

      // else if (error?.data?.file) {
      //   toast.error(error?.data?.file[0])
      // }
      else {
        toast.error('Error In Updating Feed To Chat Gpt')
      }
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onSubmit = (data1: FeedToChatGptType, e: any) => {
    e.preventDefault()

    if (mode === 'edit' && data) {
      setPayloadData({ ...data1, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    } else {
      setCreated(false)
      const formData: any = new FormData()
      formData.append('business', data1.business)
      formData.append('name', data1.name)
      formData.append('user_name', data1.user_name)
      formData.append('website_url', data1.website_url)
      formData.append('api_url', data1.api_url)
      formData.append('password', data1.password)
      formData.append('desc', data1.desc)

      if (data1.file && data1.file.length > 0) {
        formData.append('file', data1.file[0])
      }

      CreateFeedToGPT(formData)
        .then(res => {
          toast.success('Feed To GPT created successfully')
          onTypeAdded?.()
          setCreated(true)
          handleClose()
          router.replace(getLocalizedUrl('/platforms', locale as Locale))
          reset()
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        })
        .catch(error => {
          console.log(error, 'error in creation Feed To GPT')
        })
        .finally(() => {
          setLoading(false)
          reset()
        })
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit'
          ? 'Edit Feed to Gpt Information'
          : mode === 'add'
            ? 'Add Feed to Gpt Information'
            : 'GPT Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating Feed to Gpt details will receive a privacy audit'}
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
                {...register('business', { required: 'Business is required' })}
                error={!!errors.business}
                helperText={errors.business?.message}
                InputLabelProps={{
                  className: errors.business ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
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
                  required: 'Name is required'
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
                label='Website Url'
                {...register('website_url', { required: 'Website Url is required' })}
                defaultValue={data?.website_url || ''}
                {...register('website_url', {
                  required: 'Website Url is required'
                })}
                error={!!errors.website_url}
                helperText={errors.website_url?.message}
                InputLabelProps={{
                  className: errors.website_url ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {(mode === 'view' || mode === 'edit') && (
                <CustomTextField
                  fullWidth
                  label='Document File'
                  defaultValue={data?.file || ''}
                  inputProps={{
                    placeholder: 'business_doc',
                    readOnly: mode === 'view'
                  }}
                />
              )}

              {mode === 'add' && (
                <CustomTextField
                  type='file' // Input type as 'file'
                  label='Business Document *'
                  defaultValue={data?.file || ''}
                  fullWidth
                  inputProps={{
                    accept: '*' // Accept any file type
                  }}
                  {...register('file', {
                    required: 'File document is required',
                    validate: value => (value && value.length > 0) || 'File document is required'
                  })}
                  error={!!errors.file}
                  helperText={errors.file?.message}
                  InputLabelProps={{
                    className: errors.file && 'requiredFieldError'
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Api Url'
                {...register('api_url', { required: 'Api Url is required' })}
                defaultValue={data?.api_url || ''}
                {...register('api_url', {
                  required: 'Api Url is required'
                })}
                error={!!errors.api_url}
                helperText={errors.api_url?.message}
                InputLabelProps={{
                  className: errors.api_url ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='password'
                label='Password'
                {...register('password', { required: 'password is required' })}
                defaultValue={data?.password || ''}
                {...register('password', {
                  required: 'password is required'
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputLabelProps={{
                  className: errors.password ? 'requiredFieldError' : undefined
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
                {...register('user_name', { required: 'User Name is required' })}
                defaultValue={data?.user_name || ''}
                {...register('user_name', {
                  required: 'User Name is required'
                })}
                error={!!errors.user_name}
                helperText={errors.user_name?.message}
                InputLabelProps={{
                  className: errors.user_name ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Description'
                defaultValue={data?.desc || ''}
                {...register('desc', {
                  required: 'Description is required'
                })}
                error={!!errors.desc}
                helperText={errors.desc?.message}
                InputLabelProps={{
                  className: errors.desc ? 'requiredFieldError' : undefined
                }}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
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
          title='Edit Feed Gpt'
          description='Are you sure you want to edit this  Feed Gpt?'
        />
      )}
    </Dialog>
  )
}

export default EditFeedGptInfo
