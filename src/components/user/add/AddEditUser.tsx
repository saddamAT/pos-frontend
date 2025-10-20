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
import toast from 'react-hot-toast'
import { InputAdornment, ListItemText } from '@mui/material'
import IconButton from '@mui/material/IconButton'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { User } from '@/api/interface/userInterface'
import { createUser, updateUser } from '@/api/user'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type AddEditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: User
  userType: UserType[]
  mode: 'add' | 'edit' | 'view'
  onTypeAdded?: any
}
interface UserType {
  id: number | string
  type: string
  description: string
  active: boolean
}

const AddEditUser = ({ open, setOpen, data, onTypeAdded, userType, mode }: AddEditUserInfoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<User>()

  const [loading, setLoading] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<User | null>(null)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && data) {
      reset(data)
    } else {
      reset()
    }
  }, [mode, data, reset, created, updated])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: User, e: any) => {
    e.preventDefault()

    const submissionData = {
      ...data1,
      status: 'Pending'
    }

    if (mode === 'edit') {
      setPayloadData({ ...data1, id: data1?.id ?? 0 })
      setOpenConfirmation(true)
    } else {
      createUser(submissionData)
        .then(res => {
          toast.success(res?.data.message)
          setCreated(true)
          if (onTypeAdded) {
            onTypeAdded()
          }

          reset()
          setOpen(false)
        })
        .catch(error => {
          console.log(error, 'error')

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
          // reset()
        })
    }
  }

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)

      const id: number = data?.id ?? 0
      await updateUser(id, payloadData)
      toast.success('User Updated Successfully')
      setUpdated(true)
      onTypeAdded?.()
      setOpen(false)
    } catch (err: any) {
      console.log(err, 'error updating User')
      toast.error(err?.data?.message || 'Error updating User')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit' ? 'Edit User Information' : mode === 'add' ? 'Add User Information' : 'User Details'}
        <Typography component='span' className='flex flex-col text-center'>
          {mode === 'edit' && 'Updating User details will receive a privacy audit'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Company Name'
                defaultValue={data?.name || ''}
                {...register('name', { required: 'Company name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='First Name'
                defaultValue={data?.first_name || ''}
                {...register('first_name', { required: 'First name is required' })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Last Name'
                defaultValue={data?.last_name || ''}
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                defaultValue={data?.email || ''}
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                inputProps={{
                  readOnly: mode === 'view' || mode === 'edit'
                }}
              />
            </Grid>
            {mode === 'add' && (
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
            )}

            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Mobile'
                defaultValue={data?.mobile || ''}
                {...register('mobile', { required: 'Mobile number is required' })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='user_type'
                label='Select User Type'
                defaultValue={data?.user_type || ''}
                inputProps={{
                  placeholder: 'User Type',
                  ...register('user_type'),
                  readOnly: mode === 'view',
                  required: 'User Type is required'
                }}
                error={!!errors.user_type}
                helperText={errors.user_type?.message}
              >
                {userType.length > 0 ? (
                  userType.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.type}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <ListItemText primary='No User Roles found' />
                  </MenuItem>
                )}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Country'
                defaultValue={data?.country || ''}
                {...register('country', { required: 'Country is required' })}
                error={!!errors.country}
                helperText={errors.country?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='City'
                defaultValue={data?.city || ''}
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Address'
                defaultValue={data?.address || ''}
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Postal Code'
                placeholder='Enter postal code'
                defaultValue={data?.postalCode || ''}
                {...register('postalCode', { required: 'Postal code is required' })}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                inputProps={{
                  readOnly: mode === 'view'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          {(mode === 'edit' || mode === 'add') && (
            <Button variant='contained' type='submit' disabled={loading}>
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
          title='Edit User'
          description='Are you sure you want to edit this user?'
        />
      )}
    </Dialog>
  )
}

export default AddEditUser
