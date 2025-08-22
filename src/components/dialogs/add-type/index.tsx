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

import toast from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { createFoodType } from '@/api/foodTypes'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { BusinessType } from '@/api/interface/businessInterface'

type TypeInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ToppingDataType
  onTypeAdded?: any
}

const AddType = ({ open, setOpen, data, onTypeAdded }: TypeInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ToppingDataType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data: ToppingDataType, e: any) => {
    e.preventDefault()

    setLoading(true)

    createFoodType(data)
      .then(res => {
        toast.success('Type added successfully')
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
        reset()
      })
      .catch(error => {
        console.log(error, 'type creation error')

        if (error?.data && error?.data?.non_field_errors[0]) {
          toast.error(error?.data?.non_field_errors[0])
        } else {
          toast.error('Error in creating order', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
        // reset()
      })
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  return (
    <Dialog open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Type
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Type Name *'
                {...register('name', {
                  required: 'Type Name is required'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{
                  className: errors.name && 'requiredFieldError'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Business Id *'
                {...register('business', {
                  required: 'Business ID is required'
                })}
                error={!!errors.business}
                helperText={errors.business?.message}
                InputLabelProps={{
                  className: errors.business && 'requiredFieldError'
                }}
              >
                {userBusinessData &&
                  userBusinessData?.map(business => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Description *'
                {...register('description', {
                  required: 'Description is required'
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{
                  className: errors.description && 'requiredFieldError'
                }}
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
    </Dialog>
  )
}

export default AddType
