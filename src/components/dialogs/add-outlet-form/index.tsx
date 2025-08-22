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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { MenuDataType } from '@/api/interface/menuIterface'
import toast from 'react-hot-toast'

import Loader from '@/components/loader/Loader'

import { getAllBusiness } from '@/api/business'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import { createResturant } from '@/api/resturant'
import { BusinessType } from '@/api/interface/businessInterface'

type AddOutletFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const AddOutletForm = ({ open, setOpen, onTypeAdded }: AddOutletFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [businessData, setBusinessData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResturantDataType>()

  // States
  const onSubmit = (data: ResturantDataType, e: any) => {
    e.preventDefault()

    setLoading(true)

    createResturant(data)
      .then(res => {
        toast.success('Outlet registerd successfully', {
          duration: 5000
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setOpen(false)
        reset()
      })
      .catch(error => {
        console.log(error, 'error in register resto')
        toast.error(error?.data?.detail, {
          duration: 5000
        })
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    setOpen(false)
    reset()
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        setBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Outlet Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Name *'
                  fullWidth
                  placeholder='Enter Outlet Name'
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
                  label='Postal Code*'
                  fullWidth
                  placeholder='Enter Postalcode'
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
                  placeholder='Enter City Name'
                  {...register('city', { required: 'city is required' })}
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
                  placeholder='Enter Cuisine Type'
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
                  label='Contact number *'
                  type='number'
                  fullWidth
                  placeholder='(397) 294-5153'
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
                  placeholder='Enter description'
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
                  label='Catalog link *'
                  fullWidth
                  placeholder='Enter Catalog Link'
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
                  id='business'
                  label='Business *'
                  {...register('business', { required: 'Business is required' })}
                  InputLabelProps={{
                    className: errors.business && 'requiredFieldError'
                  }}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                >
                  {businessData &&
                    businessData?.map(business => (
                      <MenuItem key={business.business_id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              <Button variant='contained' type='submit' disabled={loading}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>
      </div>
    </Dialog>
  )
}

export default AddOutletForm
