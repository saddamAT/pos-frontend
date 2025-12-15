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
import { ListItemText } from '@mui/material'

type EditMenuInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  businesses: BusinessType[]
  onTypeAdded?: any
  mode: 'add' | 'edit' | 'view'
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
      toast.success('Product Updated Successfully', {
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
        {mode === 'edit' ? 'Edit Product Information' : 'Product Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating Product details will receive a privacy audit.'}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Type'
                defaultValue={data?.type?.name || ''}
                inputProps={{
                  placeholder: 'Product Type',
                  readOnly: mode === 'view'
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Business'
                inputProps={{ placeholder: 'Business', ...register('business'), readOnly: mode === 'view' }}
                defaultValue={data?.business || ''}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                {businesses.length > 0 ? (
                  businesses.map(business => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <ListItemText primary='No business found' />
                  </MenuItem>
                )}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
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
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Purcahse Price'
                fullWidth
                placeholder='Enter Purchase price '
                defaultValue={data?.price || ''}
                {...register('price', {
                  required: 'Purcahse Price is required'
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Sale Price *'
                type='number'
                fullWidth
                placeholder='Enter Sale  price '
                {...register('sale_price', {
                  required: 'Sale Price is required'
                })}
                defaultValue={data?.sale_price || ''}
                error={!!errors.sale_price}
                helperText={errors.sale_price?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          {mode === 'edit' && (
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
          title='Edit Product'
          description='Are you sure you want to edit this product?'
        />
      )}
    </Dialog>
  )
}

export default EditProduct
