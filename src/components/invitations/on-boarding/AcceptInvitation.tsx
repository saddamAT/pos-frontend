'use client'

import { acceptInvitation } from '@/api/invitations'
import { Button, Typography, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import type { Theme } from '@mui/material/styles'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import VerificationModal from './VerificationModal'
import { registerUser } from '@/api/user'
import Logo from '@/components/layout/shared/Logo'
import CustomTextField from '@/@core/components/mui/TextField'
import { OnBordingInterface, UserInvitation } from '@/types/apps/userTypes'
import { UserCreation } from '@/api/interface/userInterface'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

const AcceptInvitation = ({
  token,
  invitationRes,
  userExistsRes
}: {
  token: string
  invitationRes: UserInvitation
  userExistsRes: boolean
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserCreation>({
    defaultValues: {
      email: invitationRes?.email || '',
      password: '',
      confirmPassword: '',
      profileLink: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      role: ''
    }
  })
  const { lang: locale } = useParams() as { lang: Locale }

  const [loading, setLoading] = useState(false)

  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const [isInviteModalShown, setIsInviteModalShown] = useState<boolean>(userExistsRes) // show modal if user exists
  const [showForm, setShowForm] = useState<boolean>(!userExistsRes)

  const router = useRouter()

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }
  const handleVerificationConfirm = async (action: 'yes' | 'no') => {
    setIsInviteModalShown(false)
    if (action === 'yes') {
      console.log('yes ----->')

      const acceptPayload = {
        email: invitationRes.email,
        token: invitationRes.token,
        business: invitationRes.business,
        branch: invitationRes.branch,
        invited_by: invitationRes.invited_by,
        role: invitationRes.role
      }

      const acceptRes = await acceptInvitation(acceptPayload)
      console.log(acceptRes, 'acceptRes')

      if (acceptRes?.success) {
        // const payload = {
        //   user: userExistsRes?.user?.id,
        //   company: invitationRes?.company,
        //   role: invitationRes?.role
        // }
        // console.log('Creating user with same email in different company', payload, acceptRes)
        // const response = await addCompanyUserInvitation(payload)
        // if (response?.success) {
        //   toast.success('User created successfully')
        //   reset()
        //      router.push(getLocalizedUrl('/login', locale))
        // } else if (response?.error && typeof response.error === 'object' && 'detail' in response.error) {
        //   toast.error((response.error as { detail: string }).detail)
        // } else if (response?.error) {
        //   toast.error(String(response.error))
        // } else {
        //   toast.error('User updation failed')
        // }
      } else {
        toast.error('Invitation already used or invalid.')
        router.push(getLocalizedUrl('/login', locale))
      }
    } else {
      console.log('no create account')

      setShowForm(true)
    }
  }

  if (invitationRes.email) {
    return (
      <VerificationModal
        open={isInviteModalShown}
        setOpen={setIsInviteModalShown}
        onConfirm={handleVerificationConfirm}
        invitationRes={invitationRes}
      />
    )
  }
  const onSubmit = async (data: UserCreation) => {
    setLoading(true)
    const acceptRes = await acceptInvitation(token)
    if (acceptRes?.success) {
      console.log('acceptRes', acceptRes)

      const payload: OnBordingInterface = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        address: data.address,
        status: 'Active',
        user_role: invitationRes?.roleDetail?.role || '',
        company: {
          name: invitationRes?.companyDetail?.name || '',
          email: invitationRes.companyDetail?.email || '' // optional fallback
        },
        plan: 'standard' // default plan, can be changed later
      }
      // console.log('payload', payload, invitationRes)
      // console.log('data', invitationRes, token, userExistsRes)
      const response = await registerUser(payload)
      // console.log('response----', response)
      if (response?.success) {
        toast.success('User created successfully')
        reset()
        router.push(getLocalizedUrl('/login', locale))
      } else if (response?.error && typeof response.error === 'object' && 'detail' in response.error) {
        toast.error((response.error as { detail: string }).detail)
      } else if (response?.error) {
        toast.error(String(response.error))
      } else {
        toast.error('User updation failed')
      }
      setLoading(false)
    } else {
      toast.error('Invitation already used or invalid.')
      router.push(getLocalizedUrl('/login', locale))
    }
  }

  return (
    <>
      {' '}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='w-full max-w-2xl bg-white rounded-lg shadow-lg p-8'>
              {/* bg-actionHover */}
              <div className='w-full max-w-[90%] mx-auto p-3 rounded-lg mb-5'>
                <div className='flex flex-col items-center gap-4 text-center'>
                  <Logo />
                  <Typography color='text.primary'>
                    Welcome to POS You have been invited to join <strong>{invitationRes?.name}</strong> as{' '}
                    <strong>{invitationRes?.role}</strong>. To get started, please complete your onboarding process
                  </Typography>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='First Name'
                      placeholder='Enter your first name'
                      {...register('firstName', { required: 'First Name is required' })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </div>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Last Name'
                      placeholder='Enter your last name'
                      {...register('lastName', { required: 'Last Name is required' })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Email'
                      {...register('email', { required: 'Email is required' })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </div>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Phone Number'
                      placeholder='Enter your phone number'
                      {...register('phoneNumber', { required: 'Phone Number is required' })}
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Password'
                      placeholder='············'
                      type={isPasswordShown ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                              >
                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </div>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Confirm Password'
                      placeholder='············'
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      {...register('confirmPassword', { required: 'Confirm Password is required' })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle confirm password visibility'
                              >
                                <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <CustomTextField
                      fullWidth
                      label='Address'
                      placeholder='Enter your address'
                      {...register('address', { required: 'Address is required' })}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  </div>
                </div>

                <div className='pt-4 flex justify-center'>
                  <Button
                    fullWidth={isMobile}
                    variant='contained'
                    type='submit'
                    disabled={loading}
                    className='w-full max-w-xs text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm'
                  >
                    {loading ? 'Submitting...' : 'Create User'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {isInviteModalShown && (
        <VerificationModal
          open={isInviteModalShown}
          setOpen={setIsInviteModalShown}
          onConfirm={handleVerificationConfirm}
          invitationRes={invitationRes}
        />
      )}
    </>
  )
}

export default AcceptInvitation
