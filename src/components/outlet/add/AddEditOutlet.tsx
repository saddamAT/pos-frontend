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
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import Loader from '@/components/loader/Loader'
import toast from 'react-hot-toast'

// API & Types
import { createResturant, updateResturant } from '@/api/resturant'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import { BusinessType } from '@/api/interface/businessInterface'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import { useSession } from 'next-auth/react'
import { getUserBusinessesById } from '@/api/user'

type AddEditOutletFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ResturantDataType
  mode: 'add' | 'edit'
  userBusiness: BusinessType[]
  onTypeAdded?: () => void
}

const AddEditOutlet = ({ open, setOpen, data, mode, onTypeAdded, userBusiness }: AddEditOutletFormProps) => {
  const [loading, setLoading] = useState(false)

  const [payloadData, setPayloadData] = useState<ResturantDataType | null>(null)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const { data: session, update } = useSession()
  const userSession = useSession()
  const userId = userSession?.data?.user?.id!
  // if (!userSession?.data?.user?.id) {
  //   throw new Error('User ID missing')
  // }
  // const userId = userSession.data.user.id // Now safe

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResturantDataType>()

  useEffect(() => {
    if (mode === 'edit' && data) {
      const flattenedData: Partial<ResturantDataType> = {}
      for (const [key, value] of Object.entries(data)) {
        if (key === 'business' && value && typeof value === 'object' && 'id' in value) {
          flattenedData[key as keyof ResturantDataType] = value.id
        } else if (typeof value !== 'object') {
          flattenedData[key as keyof ResturantDataType] = value as any
        }
      }
      reset(flattenedData)
    } else {
      reset()
    }
  }, [mode, data, reset])

  const handleReset = () => {
    reset()
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)
      await updateResturant(payloadData.id, payloadData)
      const response = await getUserBusinessesById(userId)
      const businesses = response?.data ?? []
      await update({ userBusinesses: businesses })
      toast.success('Outlet Updated Successfully')
      onTypeAdded?.()
      setOpen(false)
    } catch (err: any) {
      console.log(err, 'error updating Outlet')

      toast.error(err?.data?.message || 'Error updating Outlet')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onSubmit = async (data: ResturantDataType, e: any) => {
    e.preventDefault()
    if (mode === 'edit') {
      setPayloadData({ ...data, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    } else {
      try {
        setLoading(true)
        await createResturant(data)

        const response = await getUserBusinessesById(userId)
        const businesses = response?.data ?? []
        await update({ userBusinesses: businesses })
        toast.success('Outlet Created Successfully')
        onTypeAdded?.()
        setOpen(false)
        reset()
      } catch (err: any) {
        console.log(err, 'error for add Outlet')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={handleReset} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit' ? 'Edit Outlet Information' : 'Add Outlet Information'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && (
            <Typography component='span'>Updating Outlet details will receive a privacy audit.</Typography>
          )}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Name *'
                fullWidth
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{
                  className: errors.name && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Postal Code *'
                fullWidth
                {...register('postal_code_delivery', { required: 'Postal Code is required' })}
                error={!!errors.postal_code_delivery}
                helperText={errors.postal_code_delivery?.message}
                InputLabelProps={{
                  className: errors.postal_code_delivery && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='City *'
                fullWidth
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
                InputLabelProps={{
                  className: errors.city && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Cuisine Type *'
                fullWidth
                {...register('cuisine_type', { required: 'Cuisine Type is required' })}
                error={!!errors.cuisine_type}
                helperText={errors.cuisine_type?.message}
                InputLabelProps={{
                  className: errors.cuisine_type && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Contact Number *'
                fullWidth
                {...register('contact_number', { required: 'Contact number is required' })}
                error={!!errors.contact_number}
                helperText={errors.contact_number?.message}
                InputLabelProps={{
                  className: errors.contact_number && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Description *'
                fullWidth
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{
                  className: errors.description && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Catalog Link *'
                fullWidth
                {...register('catalog_link', { required: 'Catalog Link is required' })}
                error={!!errors.catalog_link}
                helperText={errors.catalog_link?.message}
                InputLabelProps={{
                  className: errors.catalog_link && 'requiredFieldError'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Business *'
                {...register('business', { required: 'Business is required' })}
                error={!!errors.business}
                helperText={errors.business?.message}
                defaultValue={data?.business?.id ?? ''}
                InputLabelProps={{
                  className: errors.business ? 'requiredFieldError' : undefined
                }}
              >
                {userBusiness.map(b => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.business_id}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>

          <DialogActions className='justify-center mt-6'>
            <Button variant='contained' type='submit' disabled={loading}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleReset}>
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
          title='Edit Outlet'
          description='Are you sure you want to edit this Outlet?'
        />
      )}
    </Dialog>
  )
}

export default AddEditOutlet
