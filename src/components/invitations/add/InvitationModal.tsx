'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/api/interface/businessInterface'

import { CreateInvitationRequest } from '@/api/interface/userInterface'
import { createUserInvitation } from '@/api/invitations'
import { getUserType } from '@/api/user'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { UserType } from '@/types/apps/restoTypes'

import { MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type InviteUserFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: any
  onConfirm?: any
}

type InviteUserFormDataType = {
  email: string
  user_type: number
  business: number
}

const InvitationModal = ({ open, setOpen, onConfirm }: InviteUserFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userRoles, setUserRoles] = useState<UserType[]>([])
  const [businessData, setBusinessData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InviteUserFormDataType>()

  const onSubmit = async (data: any) => {
    setLoading(true)

    const payload: CreateInvitationRequest = {
      email: data?.email,
      user_type: data?.user_type,
      business: data?.business
    }

    const response: any = await createUserInvitation(payload)

    if (onConfirm) {
      onConfirm(true)
    }

    if (response?.success) {
      setOpen(false)
      reset()
      setLoading(false)
      toast.success('Invitation sent to user successfully')
    }
  }

  const handleReset = () => {
    setOpen(false)
    reset()
  }

  const fetchUserRolesAndCompanies = async () => {
    // const response1 = await getUserRoles()
    // const companyResponse = await getCompanyUsers()
    const userTypeResp = await getUserType()
    const userTypeResponse: UserType[] = userTypeResp?.data?.results ?? []
    const response = await getAllBusiness()
    const updatedData = response?.data?.results ?? []

    if (response.success) {
      setUserRoles(userTypeResponse)
      setBusinessData(updatedData)
    } else {
      toast.error('Failed to load User Roles')
    }
  }

  useEffect(() => {
    fetchUserRolesAndCompanies()
  }, [])

  return (
    <Dialog fullWidth open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Invite User Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12}>
                <CustomTextField
                  label='Email *'
                  fullWidth
                  placeholder='Enter Email'
                  {...register('email', { required: 'Email is required' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className={errors.email ? 'requiredField' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Business *'
                    {...register('business', { required: 'Business is required' })}
                    error={!!errors.business}
                    helperText={errors.business?.message}
                    InputLabelProps={{
                      className: errors.business ? 'requiredFieldError' : undefined
                    }}
                  >
                    {businessData.map(b => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.business_id}
                      </MenuItem>
                    ))}
                  </CustomTextField>{' '}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  id='user_type'
                  label='User Role'
                  {...register('user_type', { required: 'User Role is required' })}
                  error={!!errors.user_type}
                  helperText={errors.user_type?.message}
                >
                  {userRoles &&
                    userRoles.map((user: UserType) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.type}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              <Button variant='contained' type='submit' color='success' disabled={loading}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </div>
    </Dialog>
  )
}

export default InvitationModal
