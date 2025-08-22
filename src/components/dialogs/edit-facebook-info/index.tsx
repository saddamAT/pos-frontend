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
import { updateFaceBook } from '@/api/facebook'

import toast from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'

type EditFaceBookInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: FaceBookDataType
  onTypeAdded?: any
  mode?: string
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}

const EditFaceBookInfo = ({
  open,
  setOpen,
  data,
  onTypeAdded,
  mode,
  businesses,
  feedToChatGpt
}: EditFaceBookInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<FaceBookDataType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FaceBookDataType>()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: FaceBookDataType, e: any) => {
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
      await updateFaceBook(payloadData.id, payloadData)
      toast.success('Facebook Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      // console.log(error, 'error------')

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
        Edit facebook Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating facebook details will receive a privacy audit.
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
                label='FaceBook Id'
                defaultValue={data?.facebook_id || ''}
                {...register('facebook_id', {
                  required: 'facebook_id is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Access Token'
                {...register('access_token', { required: 'access_token is required' })}
                defaultValue={data?.access_token || ''}
                {...register('access_token', {
                  required: 'access_token is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='facebook_account_id'
                {...register('facebook_account_id', { required: 'facebook_account_id is required' })}
                defaultValue={data?.facebook_account_id || ''}
                {...register('facebook_account_id', {
                  required: 'facebook_account_id is required'
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
                fullWidth
                label='Catalog Id'
                {...register('catalog_id', { required: 'Catalog Id is required' })}
                defaultValue={data?.catalog_id || ''}
                {...register('catalog_id', {
                  required: 'Catalog Id is required'
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Web Hook Token'
                defaultValue={data?.webhook_token || ''}
                {...register('webhook_token', {
                  required: 'Web Hook Token is required'
                })}
              />
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
          title='Edit Facebook'
          description='Are you sure you want to edit this Facebook?'
        />
      )}
    </Dialog>
  )
}

export default EditFaceBookInfo
