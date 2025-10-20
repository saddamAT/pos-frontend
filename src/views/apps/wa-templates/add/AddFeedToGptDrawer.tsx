// React Imports
import { useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
// MUI Imports

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { InputAdornment, ListItemText, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Loader from '@/components/loader/Loader'
import { CreateFeedToGPT } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
}

const AddFeedToGptDrawer = ({ open, handleClose, businesses }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FeedToChatGptType>()

  const onSubmit = (data: FeedToChatGptType, e: any) => {
    e.preventDefault()
    setLoading(true)

    const formData: any = new FormData()
    formData.append('business', data.business)
    formData.append('name', data.name)
    formData.append('user_name', data.user_name)
    formData.append('website_url', data.website_url)
    formData.append('api_url', data.api_url)
    formData.append('password', data.password)
    formData.append('desc', data.desc)

    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0])
    }

    CreateFeedToGPT(formData)
      .then(res => {
        toast.success('Feed To GPT created successfully')
        handleClose()

        router.replace(getLocalizedUrl('/platforms', locale as Locale))

        reset()
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })
      .catch(error => {
        console.log(error, 'error in creation Feed To GPT')
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    handleClose()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'> Feed To GPT</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Business *'
                    placeholder='Business'
                    error={!!errors.business}
                    helperText={errors.business?.message}
                    InputLabelProps={{
                      className: errors.business ? 'requiredFieldError' : undefined
                    }}
                    {...register('business', {
                      required: 'Business is required'
                    })}
                  >
                    {businesses.length > 0 ? (
                      businesses.map(business => (
                        <MenuItem key={business.id} value={business.id}>
                          {business.business_id}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary='No business found' />
                      </MenuItem>
                    )}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Name *'
                    fullWidth
                    placeholder='Enter name '
                    {...register('name', { required: 'name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputLabelProps={{
                      className: errors.name && 'requiredFieldError'
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Website url *'
                    fullWidth
                    placeholder='Enter Website url'
                    {...register('website_url', { required: 'Website url is required' })}
                    error={!!errors.website_url}
                    helperText={errors.website_url?.message}
                    InputLabelProps={{
                      className: errors.website_url && 'requiredFieldError'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Api url *'
                    fullWidth
                    {...register('api_url', { required: 'Api url is required' })}
                    error={!!errors.api_url}
                    helperText={errors.api_url?.message}
                    InputLabelProps={{
                      className: errors.api_url && 'requiredFieldError'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='User name *'
                    fullWidth
                    {...register('user_name', {
                      required: 'User name is required'
                    })}
                    error={!!errors.user_name}
                    helperText={errors.user_name?.message}
                    InputLabelProps={{
                      className: errors.user_name && 'requiredFieldError'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    id='outlined-adornment-password'
                    label='Password *'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password', { required: 'Password is required' })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            edge='end'
                            aria-label='toggle password visibility'
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    InputLabelProps={{
                      className: errors.password ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Description *'
                    fullWidth
                    {...register('desc', { required: 'Description is required' })}
                    error={!!errors.desc}
                    helperText={errors.desc?.message}
                    InputLabelProps={{
                      className: errors.desc && 'requiredFieldError'
                    }}
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
                    {...register('file', {
                      required: 'File document is required',
                      validate: value => (value && value.length > 0) || 'File document is required'
                    })}
                    error={!!errors.file}
                    helperText={errors.file?.message}
                    InputLabelProps={{
                      className: errors.file && 'requiredFieldError'
                    }}
                  />
                </Grid>
              </Grid>

              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit' disabled={loading}>
                  Submit
                </Button>
                <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                  Cancel
                </Button>
              </div>
              {loading && <Loader />}
            </CardContent>
          </Card>
        </form>
      </div>
    </Drawer>
  )
}

export default AddFeedToGptDrawer
