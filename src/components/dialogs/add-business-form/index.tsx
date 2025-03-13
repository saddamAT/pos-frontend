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
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import OpenDialogOnElementClick from '../OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import Loader from '@/components/loader/Loader'
import type { User } from '@/api/interface/userInterface'
import { createUser, getAllUsers, getUserTypes } from '@/api/user'
import { InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { createBusiness, getAllBusiness } from '@/api/business'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import { BusinessType } from '@/types/apps/businessTypes'
import { createResturant } from '@/api/resturant'
import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'
import { useAuthStore } from '@/store/authStore'
import { CurrencyDataType } from '@/api/interface/currencyInterface'
import { getAllCurrencies } from '@/api/currencies'

type AddUserFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddBusinessForm = (
  { open, setOpen, onTypeAdded }: AddUserFormProps
  //   { open, handleClose }: Props
) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuthStore()

  const [businessData, setBusinessData] = useState<BusinessType[]>([])
  const [currencyData, setCurrencyData] = useState<CurrencyDataType[]>([])
  const [userData, setUserData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<BusinessDataTypeForAddBusiness>()

  const onSubmit = (data: BusinessDataTypeForAddBusiness, e: any) => {
    setLoading(true)

    console.log(data, ' sunmission data')

    const formData: any = new FormData()
    formData.append('business_id', data.business_id)
    formData.append('name', data.name)
    formData.append('business_address', data.business_address)
    formData.append('business_desc', data.business_desc)
    formData.append('contact_number', data.contact_number)
    formData.append('business_initial', data.business_initial)
    formData.append('currency', data.currency)

    if (user && user?.user_type === 'admin') {
      formData.append('user', data?.user)
    } else {
      formData.append('user', user?.id)
    }

    formData.append('business_desc', data.business_desc)

    if (data.business_doc && data.business_doc.length > 0) {
      formData.append('business_doc', data.business_doc[0])
    }

    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0])
    }

    createBusiness(formData)
      .then(res => {
        // toast.success('Business created successfully')
        toast.success('Business created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
        reset()
      })
      .catch(error => {
        // console.log(error, 'error in creation Business')
        // if (error?.data && error?.data?.user[0]) {
        //   toast.error(error?.data?.user[0])
        // } else {
        //   toast.error('Error in creating business')
        // }
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
        const businessResponse = await getAllBusiness()

        const currencyResponce = await getAllCurrencies()
        setCurrencyData(currencyResponce?.data?.results || [])
        setBusinessData(businessResponse?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const response = await getAllUsers()

        setUserData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Business Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Business Name *'
                  fullWidth
                  placeholder='Enter Business Name'
                  {...register('name', { required: 'Business Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Business Meta Id *'
                  fullWidth
                  placeholder='Enter business Meta Id'
                  {...register('business_id', { required: 'Business Meta Id is required' })}
                  error={!!errors.business_id}
                  helperText={errors.business_id?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  label='Business description *'
                  fullWidth
                  placeholder='Enter business description'
                  {...register('business_desc', { required: 'Business description is required' })}
                  error={!!errors.business_desc}
                  helperText={errors.business_desc?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Business address *'
                  fullWidth
                  placeholder='Enter business address '
                  {...register('business_address', { required: 'Business address is required' })}
                  error={!!errors.business_address}
                  helperText={errors.business_address?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  type='file' // Input type as 'file'
                  label='Business Logo *'
                  fullWidth
                  inputProps={{
                    accept: '*' // Accept any file type
                  }}
                  {...register(
                    'logo'
                    // { required: 'Business Logo is required' }
                  )}
                  // error={!!errors.logo}
                  // helperText={errors.logo?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  type='file' // Input type as 'file'
                  label='Business Document *'
                  fullWidth
                  inputProps={{
                    accept: '*' // Accept any file type
                  }}
                  {...register('business_doc', { required: 'Business document is required' })}
                  error={!!errors.business_doc}
                  helperText={errors.business_doc?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Business Initial *'
                  placeholder='Enter business Initial'
                  {...register('business_initial', {
                    required: 'Business initial is required',
                    pattern: {
                      value: /^[A-Z]{1,5}$/,
                      message: 'Only up to 5 capital letters are allowed'
                    }
                  })}
                  error={!!errors.business_initial}
                  helperText={errors.business_initial?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id='currency'
                  label='Select Currency *'
                  inputProps={{ placeholder: 'Currency', ...register('currency') }}
                  error={!!errors.currency}
                  helperText={errors.currency?.message}
                >
                  {currencyData &&
                    currencyData.map((item: any) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.label}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Contact number *'
                  fullWidth
                  placeholder='Enter contact number'
                  {...register('contact_number', { required: 'contact number is required' })}
                  error={!!errors.contact_number}
                  helperText={errors.contact_number?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {user && user?.user_type === 'admin' && (
                  <CustomTextField
                    select
                    fullWidth
                    id='user'
                    label='Select user *'
                    inputProps={{ placeholder: 'User', ...register('user') }}
                    error={!!errors.user}
                    helperText={errors.user?.message}
                  >
                    {userData &&
                      userData.map((item: any) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.first_name}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                )}
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

        <Toaster />
      </div>
    </Dialog>
  )
}

export default AddBusinessForm
