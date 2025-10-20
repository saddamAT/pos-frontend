'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { toast as hotToast } from 'react-hot-toast'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAuthStore } from '@/store/authStore'
import { getUserBusinessesById, updateUser } from '@/api/user'
import { useForm } from 'react-hook-form'
import { User } from '@/api/interface/userInterface'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useSession } from 'next-auth/react'

const AccountDetails = () => {
  const [fileInput, setFileInput] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const { data } = useSession()

  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>()

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const onSubmit = async (data1: User, e: any) => {
    e.preventDefault()

    const id: number = data?.user?.id ?? 0
    try {
      await updateUser(id, data1)

      hotToast.success('User Updated Successfully')
      router.replace(getLocalizedUrl('/home', locale as Locale))
    } catch (error: any) {
      console.log(error, 'error User Update api')
      hotToast.error(error?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Company Name'
                defaultValue={data?.user?.name || ''}
                {...register('name', { required: 'Company name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='First Name'
                defaultValue={data?.user?.first_name || ''}
                {...register('first_name', { required: 'First name is required' })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Last Name'
                defaultValue={data?.user?.last_name || ''}
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                defaultValue={data?.user?.email || ''}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Mobile'
                defaultValue={data?.user?.mobile || ''}
                {...register('mobile', { required: 'Mobile number is required' })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Role'
                defaultValue={data?.user?.user_type || ''}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Country'
                defaultValue={data?.user?.country || ''}
                {...register('country', { required: 'Country is required' })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='City'
                defaultValue={data?.user?.city || ''}
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Address'
                defaultValue={data?.user?.address || ''}
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Postal Code'
                placeholder='Enter postal code'
                defaultValue={data?.user?.postalCode || ''}
                {...register('postalCode', { required: 'Postal code is required' })}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
            </Grid>

            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
