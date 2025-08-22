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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast from 'react-hot-toast'

import Loader from '@/components/loader/Loader'
import type { User } from '@/api/interface/userInterface'
import { createUser } from '@/api/user'
import { InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'

type AddUserFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: UserType[]
  onTypeAdded?: any
}

interface UserType {
  id: number | string
  type: string
  description: string
  active: boolean
}

const AddUser = ({ open, setOpen, data, onTypeAdded }: AddUserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<User>()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = (data: User, e: any) => {
    e.preventDefault()
    setLoading(true)

    const submissionData = {
      ...data,
      status: 'Pending'
    }

    createUser(submissionData)
      .then(res => {
        toast.success(res?.data.message)
        if (onTypeAdded) {
          onTypeAdded()
        }

        reset()
        setOpen(false)
      })
      .catch(error => {
        if (error?.email) {
          toast.error(error?.email[0])
        } else {
          toast.error('An error occurred in creating user', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
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
  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add User Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Company Name *'
                  placeholder='Enter company name'
                  {...register('name', { required: 'Company name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='First Name *'
                  placeholder='Enter your first name'
                  {...register('first_name', { required: 'First name is required' })}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Last Name *'
                  placeholder='Enter your last name'
                  {...register('last_name', { required: 'Last name is required' })}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Email *'
                  placeholder='Enter your email'
                  {...register('email', { required: 'Email is required' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Mobile *'
                  placeholder='Enter your mobile'
                  {...register('mobile', { required: 'Mobile number is required' })}
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Password *'
                  placeholder='············'
                  type={isPasswordShown ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id='user_type'
                  label='Select User Type *'
                  inputProps={{ placeholder: 'User Type', ...register('user_type') }}
                  error={!!errors.user_type}
                  helperText={errors.user_type?.message}
                >
                  {data &&
                    data.map((user: UserType) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.type}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Country *'
                  placeholder='Enter Your Country'
                  {...register('country', { required: 'country is required' })}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='City *'
                  placeholder='Enter Your City'
                  {...register('city', { required: 'City is required' })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Address *'
                  placeholder='Enter Your Address'
                  {...register('address', { required: 'address is required' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Postal Code *'
                  placeholder='Enter Postal Code '
                  {...register('postalCode', { required: 'Postal Code is required' })}
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                />
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

export default AddUser
