'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import CustomTextField from '@/@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MenuItem from '@mui/material/MenuItem'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { FeedPostalCodes } from '@/api/postalCodes'
import toast from 'react-hot-toast'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type PostalCodesFormProps = {
  businesses: BusinessType[]
}

const PostalCodesForm = ({ businesses }: PostalCodesFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<postalCodesDataType>()

  const onSubmit = (data: postalCodesDataType, e: any) => {
    e.preventDefault()
    setLoading(true)

    FeedPostalCodes(data)
      .then(res => {
        toast.success('Postal Code added successfully')
        router.replace(getLocalizedUrl('/home', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in FeedPostalCodes')
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            title='Postal Codes'
            subheader='Display postal codes of business from your connected accounts on your site'
          />
          <CardContent className='flex flex-col gap-4'>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Business *'
                  {...register('business', {
                    required: 'Business is required'
                  })}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                  InputLabelProps={{
                    className: errors.business ? 'requiredFieldError' : undefined
                  }}
                >
                  {businesses &&
                    businesses?.map(business => (
                      <MenuItem key={business.id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='City'
                fullWidth
                placeholder='Enter City'
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Codes'
                fullWidth
                placeholder='Enter Code'
                {...register('code', { required: 'Code is required' })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </Grid>
            <Box display='flex' justifyContent='center' mt={3}>
              <Button type='submit' variant='contained' color='primary' disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default PostalCodesForm
