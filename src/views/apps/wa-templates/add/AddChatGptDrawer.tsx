// React Imports
import { useState } from 'react'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { ListItemText, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Loader from '@/components/loader/Loader'
import { CreateChatGPT } from '@/api/chatGpt'
import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'

type Props = {
  open: boolean
  handleClose: () => void
  businesses: BusinessType[]
}

const AddChatGptDrawer = ({ open, handleClose, businesses }: Props) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const [loading, setLoading] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<ChatGptType>({
    defaultValues: {
      business: 0,
      desc: '',
      gpt_api_key: '',
      active: false
    }
  })

  const onSubmit = (data: ChatGptType, e: any) => {
    e.preventDefault()
    if (!isActive) {
      setError('active', { type: 'manual', message: 'Active must be checked' })
      return
    }
    setLoading(true)

    const payload = { ...data, active: isActive }

    CreateChatGPT(payload)
      .then(res => {
        toast.success('Chat Gpt created successfully')

        handleClose()

        // router.replace(getLocalizedUrl('/account-settings', locale as Locale))
        router.replace(getLocalizedUrl('/platforms', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in Chat Gpt')
      })
      .finally(() => {
        setLoading(false)
        reset()
        setIsActive(false)
        reset({
          business: 0
        })
        setIsActive(false)
      })
  }

  const handleReset = () => {
    handleClose()
    reset()
    setIsActive(false)
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
        <Typography variant='h5'> Chat GPT</Typography>
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
                <Grid item xs={12}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Business *'
                    error={!!errors.business}
                    helperText={errors.business?.message}
                    {...register('business', {
                      required: 'Business is required'
                    })}
                    InputLabelProps={{
                      className: errors.business ? 'requiredFieldError' : undefined
                    }}
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

                <Grid item xs={12}>
                  <CustomTextField
                    label='Description *'
                    fullWidth
                    {...register('desc', { required: 'Description is required' })}
                    error={!!errors.desc}
                    helperText={errors.desc?.message}
                    InputLabelProps={{
                      className: errors.desc ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Gpt Api Key *'
                    fullWidth
                    {...register('gpt_api_key', { required: 'Gpt Api Key is required' })}
                    error={!!errors.gpt_api_key}
                    helperText={errors.gpt_api_key?.message}
                    InputLabelProps={{
                      className: errors.gpt_api_key ? 'requiredFieldError' : undefined
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
                  <FormControl error={!!errors.active}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color='primary'
                          checked={isActive}
                          onChange={e => {
                            const checked = e.target.checked
                            setIsActive(checked)
                            if (!checked) {
                              setError('active', { type: 'manual', message: 'Active must be checked' })
                            } else {
                              clearErrors('active')
                            }
                          }}
                        />
                      }
                      label='Active'
                    />
                    {errors.active && <FormHelperText>{errors.active.message}</FormHelperText>}
                  </FormControl>
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

export default AddChatGptDrawer
