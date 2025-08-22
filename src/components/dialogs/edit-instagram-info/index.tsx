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
import { InstagramDataType } from '@/api/interface/instagramInterface'
import { updateInstagram } from '@/api/instagram'
import toast from 'react-hot-toast'
import { FeedToChatGptFileType, FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditInstagramInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: InstagramDataType
  onTypeAdded?: any
  mode?: string
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const EditInstagramInfo = ({
  open,
  setOpen,
  data,
  onTypeAdded,
  mode,
  businesses,
  feedToChatGpt
}: EditInstagramInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<InstagramDataType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<InstagramDataType>()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: InstagramDataType, e: any) => {
    console.log(data1, 'data1')

    e.preventDefault()

    if (mode === 'edit' && data) {
      setPayloadData({ ...data1, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return

    try {
      setLoading(true)
      await updateInstagram(payloadData.id, payloadData)
      toast.success('Instagram Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      // console.log(error, 'error')

      if (error?.data?.detail) {
        toast.error(error?.data?.detail)
      } else if (error?.data?.business) {
        toast.error(error?.data?.business[0])
      } else if (error?.data?.active) {
        toast.error(error?.data?.active[0])
      } else {
        toast.error('Error In Updating Instagram Feed')
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
        Edit Instagram Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Instagram details will receive a privacy audit.
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
                // inputProps={{ placeholder: 'Business', ...register('business') }}
                inputProps={{
                  readOnly: mode === 'edit',
                  ...register('business')
                }}
                error={!!errors.business}
                helperText={errors.business?.message}
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
                fullWidth
                label='Instagram Id'
                defaultValue={data?.instagram_id || ''}
                {...register('instagram_id', {
                  required: 'Instagram Id is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Access Token'
                {...register('access_token', { required: 'Access Token is required' })}
                defaultValue={data?.access_token || ''}
                {...register('access_token', {
                  required: 'access_token is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Account Id'
                {...register('account_id', { required: 'Account Id is required' })}
                defaultValue={data?.account_id || ''}
                {...register('account_id', {
                  required: 'Account Id is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='feed_to_gpt'
                label='Feed to gpt'
                defaultValue={data?.feed_to_gpt || ''}
                inputProps={{ placeholder: 'feed to gpt', ...register('feed_to_gpt') }}
                error={!!errors.feed_to_gpt}
                helperText={errors.feed_to_gpt?.message}
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
                select
                fullWidth
                label='Status'
                defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
                {...register('active', { required: 'Status is required' })}
                error={!!errors.active}
                helperText={errors.active?.message}
              >
                <MenuItem value='' disabled>
                  Status
                </MenuItem>
                <MenuItem value='true'>Active</MenuItem>
                <MenuItem value='false'>Inactive</MenuItem>
              </CustomTextField>
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
          title='Edit Instagram'
          description='Are you sure you want to edit this Instagram?'
        />
      )}
    </Dialog>
  )
}

export default EditInstagramInfo
