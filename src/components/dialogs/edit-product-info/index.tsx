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
import { MenuDataType } from '@/api/interface/menuIterface'
import { updateMenu } from '@/api/menu'
import toast from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

type EditMenuInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  businesses: BusinessType[]
  onTypeAdded?: any
  mode?: string
}

const EditProduct = ({ open, setOpen, data, onTypeAdded, mode, businesses }: EditMenuInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MenuDataType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [payloadData, setPayloadData] = useState<MenuDataType | null>(null)
  const [openConfirmation, setOpenConfirmation] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: MenuDataType, e: any) => {
    e.preventDefault()
    if (mode === 'edit') {
      setPayloadData({
        ...data1,
        id: data?.id ?? 0
      })
      setOpenConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      const res = await updateMenu(payloadData.id, payloadData)
      toast.success('Menu Updated Successfully', {
        duration: 5000 // Duration in milliseconds (5 seconds)
      })
      if (onTypeAdded) {
        onTypeAdded()
      }
      setOpen(false)
    } catch (error: any) {
      console.log(error, 'error Product Update api')
      if (error?.data?.type?.[0]) {
        toast.error(error.data.type[0], {
          duration: 5000
        })
      } else {
        toast.error('error in updating Product', {
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Product Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Product details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Title'
                defaultValue={data?.title || ''}
                {...register('title', {
                  required: 'Title is required'
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Description'
                defaultValue={data?.description || ''}
                {...register('description', {
                  required: 'Description is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Type'
                defaultValue={data?.type?.name || ''}
                inputProps={{
                  placeholder: 'Menu Type',
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='SKU'
                defaultValue={data?.sku || ''}
                {...register('sku', {
                  required: 'SKU is required',
                  pattern: {
                    value: /^[a-z0-9_]+$/,
                    message: 'Only lowercase letters, numbers, and underscores are allowed'
                  }
                })}
                error={!!errors.sku}
                helperText={errors.sku?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Business'
                inputProps={{ placeholder: 'Business', ...register('business') }}
                defaultValue={data?.business || ''}
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
                label='Brand*'
                fullWidth
                placeholder='Enter Brand'
                defaultValue={data?.brand || ''}
                {...register('brand', { required: 'Brand is required ' })}
                error={!!errors.brand}
                helperText={errors.brand?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.status}
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value='' disabled>
                  Status
                </MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Image link'
                placeholder={data && data?.image_link}
                defaultValue={data?.image_link}
                {...register('image_link', { required: 'Image link is required' })}
                error={!!errors.image_link}
                helperText={errors.image_link?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Link'
                placeholder={data && data?.image_link}
                defaultValue={data?.image_link}
                {...register('image_link', { required: 'link is required' })}
                error={!!errors.image_link}
                helperText={errors.image_link?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Price(currency symbol)'
                fullWidth
                placeholder='Enter  price '
                defaultValue={data?.price || ''}
                {...register('price', {
                  required: 'Price is required'
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Purchase Price *'
                type='number'
                fullWidth
                placeholder='Enter Purchase  price '
                {...register('purchase_price', {
                  required: 'Purchase Price is required'
                })}
                defaultValue={data?.purchase_price || ''}
                error={!!errors.purchase_price}
                helperText={errors.purchase_price?.message}
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
          title='Edit Menu'
          description='Are you sure you want to edit this Menu?'
        />
      )}
    </Dialog>
  )
}

export default EditProduct
