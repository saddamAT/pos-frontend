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
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { updateWhatsApp } from '@/api/whatsapp'
import toast from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import ConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditWhatsAppInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: WhatsAppDataType
  onTypeAdded?: any
  mode?: string
}

const EditWhatsAppInfo = ({ open, setOpen, data, onTypeAdded, mode }: EditWhatsAppInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WhatsAppDataType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [payloadData, setPayloadData] = useState<WhatsAppDataType | null>(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: WhatsAppDataType, e: any) => {
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
        Edit whatsApp Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating whatsApp details will receive a privacy audit.
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
                label='Phone Id'
                defaultValue={data?.phone_id || ''}
                {...register('phone_id', {
                  required: 'Phone Id is required'
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Access Token'
                {...register('access_token', { required: 'Access Token is required' })}
                defaultValue={data?.access_token || ''}
                {...register('access_token', {
                  required: 'Access Token is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='WhatsApp Account Id'
                {...register('whatsapp_account_id', { required: 'WhatsApp Account Id is required' })}
                defaultValue={data?.whatsapp_account_id || ''}
              />
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
                  Select Status
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
