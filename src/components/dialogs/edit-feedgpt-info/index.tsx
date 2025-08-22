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
import toast from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { updateFeedToGPT } from '@/api/feedToChatGPT'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditFeedGptInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: FeedToChatGptType
  onTypeAdded?: any
  mode?: string
}

const EditFeedGptInfo = ({ open, setOpen, data, onTypeAdded, mode }: EditFeedGptInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FeedToChatGptType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<FeedToChatGptType | null>(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)
      await updateFeedToGPT(payloadData.id, payloadData)
      toast.success('Feed To Chat Gpt Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      if (error?.data?.detail) {
        toast.error(error?.data?.detail)
      } else if (error?.data?.business) {
        toast.error(error?.data?.business[0])
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0])
      } else {
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
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Feed to Gpt Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Feed to Gpt details will receive a privacy audit.
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
                inputProps={{
                  readOnly: mode === 'edit',
                  ...register('business')
                }}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                {userBusinessData &&
                  userBusinessData?.map(business => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Document File'
                defaultValue={data?.file || ''}
                inputProps={{
                  placeholder: 'business_doc',
                  readOnly: true
                }}
              />
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                // type='password'
                label='Password'
                {...register('password', { required: 'password is required' })}
                defaultValue={data?.password || ''}
                {...register('password', {
                  required: 'password is required'
                })}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
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
