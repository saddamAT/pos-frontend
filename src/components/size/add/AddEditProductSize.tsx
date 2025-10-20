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

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast from 'react-hot-toast'
import Loader from '@/components/loader/Loader'
import { updateMenuSize } from '@/api/size'
import { SizeDataType } from '@/api/interface/sizeInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type AddProductFormSizeProps = {
  open: boolean
  setOpen: (open: boolean) => void
  menuSizeItemData?: SizeDataType
  onTypeAdded?: any
  mode: 'add' | 'edit' | 'view'
  onCreateSize: (isCreated: boolean) => void
}

const AddEditProductSize = ({ open, setOpen, menuSizeItemData, onTypeAdded, mode }: AddProductFormSizeProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<SizeDataType | null>(null)

  const menuSizeId: number = menuSizeItemData?.id ?? 0

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SizeDataType>()

  const onSubmit = (data: SizeDataType, e: any) => {
    e.preventDefault()

    if (mode === 'edit') {
      setPayloadData(data)
      setOpenConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)
      await updateMenuSize(menuSizeId, payloadData)
      toast.success('Product Size Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (err: any) {
      console.log(err, 'error updating Menu Sizetlet')

      toast.error(err?.data?.message || 'Error updating Menu Size')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleReset = () => {
    setOpen(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      // maxWidth='md'
      // fullWidth
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit' ? 'Edit Product Size Information' : 'Product Size Details'}
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Size'
                  fullWidth
                  placeholder='Enter  Size'
                  {...register('name', { required: 'Size is required' })}
                  defaultValue={menuSizeItemData && menuSizeItemData?.name}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Description'
                  fullWidth
                  placeholder='Enter Description'
                  {...register('description', { required: 'Description is required' })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  defaultValue={menuSizeItemData && menuSizeItemData?.description}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Price'
                  fullWidth
                  placeholder='Enter Price'
                  {...register('additional_price', {
                    required: 'Price is required',
                    pattern: {
                      value: /^(?:\s*(Rs|₨|PKR|\$|USD)?\s*\d{1,3}(?:[,.]?\d{3})*(?:\.\d{1,2})?\s*(Rs|₨|PKR|\$|USD)?)$/i,
                      message:
                        'Please enter a valid price in PKR or USD (e.g., Rs 1999, $5000, 1000 PKR, ₨120000, 1,000 USD)'
                    }
                  })}
                  error={!!errors.additional_price}
                  helperText={errors.additional_price?.message}
                  defaultValue={menuSizeItemData && menuSizeItemData?.additional_price}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Product'
                  fullWidth
                  defaultValue={menuSizeItemData && menuSizeItemData?.menu?.title}
                  inputProps={{
                    readOnly: mode === 'view'
                  }}
                />
              </Grid>
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              {mode === 'edit' && (
                <Button variant='contained' type='submit' disabled={loading}>
                  Submit
                </Button>
              )}

              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>
        {mode === 'edit' && (
          <UpdateConfirmationDialog
            openConfirmation={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
            onConfirm={handleConfirm}
            title='Edit Product Size'
            description='Are you sure you want to edit this product size?'
          />
        )}{' '}
      </div>
    </Dialog>
  )
}

export default AddEditProductSize
