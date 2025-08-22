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
import Typography from '@mui/material/Typography'
// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast from 'react-hot-toast'
import { updatePostalCodes } from '@/api/postalCodes'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { MenuItem } from '@mui/material'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditPostalCodesInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: postalCodesDataType
  onTypeAdded?: any
  mode?: string
  businesses: BusinessType[]
}

const EditPostalCodesInfo = ({ open, setOpen, data, onTypeAdded, mode, businesses }: EditPostalCodesInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  console.log(data, 'data')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<postalCodesDataType>()

  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<postalCodesDataType | null>(null)

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: postalCodesDataType, e: any) => {
    e.preventDefault()
    if (mode === 'edit') {
      setPayloadData({ ...data1, id: data1?.business ?? 0 })
      setOpenConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return

    const id = data?.id ?? 0
    setLoading(true)

    try {
      await updatePostalCodes(id, payloadData)

      toast.success('Postal Codes updated successfully', {
        duration: 5000
      })

      onTypeAdded?.()
      setOpen(false)
    } catch (error) {
      console.error('Error updating postal codes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Postal Codes Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Postal Codes details will receive a privacy audit.
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
                inputProps={{ placeholder: 'Business', ...register('business') }}
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
                label='Postal Codes'
                defaultValue={data?.code || ''}
                {...register('code', {
                  required: 'Postal Codes is required'
                })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='City'
                defaultValue={data?.city || ''}
                {...register('city', {
                  required: 'city is required'
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
          title='Edit Postal Codes'
          description='Are you sure you want to edit this Postal Codes?'
        />
      )}
    </Dialog>
  )
}

export default EditPostalCodesInfo
