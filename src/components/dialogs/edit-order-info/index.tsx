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
import toast from 'react-hot-toast'
import { OrderDataType } from '@/api/interface/orderInterface'
import { updateOrder } from '@/api/order'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditOrderInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: OrderDataType
  onTypeAdded?: any
  mode?: string
}

const EditOrderInfo = ({ open, setOpen, data, onTypeAdded, mode }: EditOrderInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<OrderDataType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrderDataType>()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: OrderDataType, e: any) => {
    e.preventDefault()

    if (mode === 'edit') {
      setPayloadData({ ...data1, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return

    try {
      setLoading(true)
      await updateOrder(payloadData.id, payloadData)
      toast.success('Order Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.detail, {
        duration: 5000
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Order Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Order details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.status || ''}
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value='' disabled>
                  Select Status
                </MenuItem>

                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='confirmed'>Confirmed</MenuItem>
                <MenuItem value='cancelled'>Cancelled</MenuItem>
                <MenuItem value='ready_for_pickup'>Ready for Pickup</MenuItem>
                <MenuItem value='picked_up'>Picked Up</MenuItem>
                <MenuItem value='out_for_delivery'>Out for Delivery</MenuItem>
                <MenuItem value='delivered'>Delivered</MenuItem>
                <MenuItem value='failed'>Failed</MenuItem>
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
          title='Edit Order'
          description='Are you sure you want to edit this Order?'
        />
      )}
    </Dialog>
  )
}

export default EditOrderInfo
