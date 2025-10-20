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
import { toast } from 'react-hot-toast'
import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { CreateChatGPT, updateChatGPT } from '@/api/chatGpt'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { ListItemText } from '@mui/material'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useAuthStore } from '@/store/authStore'

type EditChatGptInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ChatGptType
  onTypeAdded?: any
  mode: 'add' | 'edit' | 'view'
}

const EditChatGptInfo = ({ open, setOpen, data, onTypeAdded, mode }: EditChatGptInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<ChatGptType | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const { lang: locale } = useParams() as { lang: Locale }
  const router = useRouter()
  const { businessData } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<ChatGptType>({
    defaultValues: {
      business: 0,
      desc: '',
      gpt_api_key: '',
      active: false
    }
  })

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
    clearErrors()
  }

  const onSubmit = (data1: ChatGptType, e: any) => {
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

      CreateChatGPT(payload)
        .then(res => {
          toast.success('Chat Gpt created successfully')
          onTypeAdded?.()
          handleClose()
          setCreated(true)
          router.replace(getLocalizedUrl('/platforms', locale as Locale))
        })
        .catch(error => {
          console.log(error?.data, 'error in Chat Gpt')
          if (error?.data && error?.data?.business) {
            toast.error(error?.data?.business[0])
          } else {
            toast.error('Error in creating Chat Gpt')
          }
        })
        .finally(() => {
          setLoading(false)
          reset()
          setIsActive(false)
          reset({
            business: 0
          })
          setIsActive(false)
        })
    }
  }
  const handleConfirm = async () => {
    setUpdated(false)
    if (!payloadData) return
    try {
      setLoading(true)
      await updateChatGPT(payloadData.id, payloadData)
      toast.success('Feed To Chat Gpt Updated Successfully')
      setUpdated(true)
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      // console.log(error, 'error--')

      if (error?.data?.detail) {
        toast.error(error?.data?.detail, {
          duration: 5000
        })
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0], {
          duration: 5000
        })
      } else {
        toast.error('Error In Updating  Chat Gpt', {
          duration: 5000
        })
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
          ? 'Edit Chat Gpt Information'
          : mode === 'add'
            ? 'Add Chat Gpt Information'
            : 'Chat Gpt Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && ' Updating Chat Gpt details will receive a privacy audit'}
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
                label='Gpt api key'
                {...register('gpt_api_key', { required: 'Gpt api key is required' })}
                error={!!errors.gpt_api_key}
                helperText={errors.gpt_api_key?.message}
                defaultValue={data?.gpt_api_key || ''}
                inputProps={{
                  readOnly: mode === 'view'
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
          title='Edit Chat Gpt'
          description='Are you sure you want to edit this  Chat Gpt?'
        />
      )}
    </Dialog>
  )
}

export default EditChatGptInfo
