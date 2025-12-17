'use client'

// React
import { useMemo, useState } from 'react'

// Next / Forms
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

// MUI
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Utils / Types
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import classnames from 'classnames'
import toast from 'react-hot-toast'
import type { SystemMode } from '@core/types'

// Components
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import Loader from '@/components/loader/Loader'

// Config & Hooks
import themeConfig from '@configs/themeConfig'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Auth
import { signIn, useSession } from 'next-auth/react'

// Images
const darkImg = '/images/pages/auth-mask-dark.png'
const lightImg = '/images/pages/auth-mask-light.png'
const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

// Styled
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: { maxBlockSize: 550 },
  [theme.breakpoints.down('lg')]: { maxBlockSize: 450 }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Domain types
import type { LoginUser } from '@/api/interface/userInterface'
// import PostLoginModal, { UserBusiness } from '@/components/business/modal/PostLoginModal'

const Login = ({ mode }: { mode: SystemMode }) => {
  const [loading, setLoading] = useState(false)
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  // const [showPostLogin, setShowPostLogin] = useState(false)

  // const { data: session } = useSession()
  // console.log(session, 'session---876342')

  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginUser>()

  const onSubmit = async (data: LoginUser) => {
    try {
      setLoading(true)
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      setLoading(false)

      console.log(res, 'res---------->')

      if (res && res.ok && res.error === null) {
        toast.success('Logged in successfully.')
        router.replace(getLocalizedUrl('/home?postLogin=1', locale))
      } else {
        // Try to parse error message
        let errorMessage = 'Login failed'

        if (res?.error) {
          try {
            // If error is a JSON string
            const parsed = JSON.parse(res.error)
            if (parsed.non_field_errors && parsed.non_field_errors.length > 0) {
              errorMessage = parsed.non_field_errors[0]
            } else {
              errorMessage = res.error
            }
          } catch {
            // If error is plain string
            errorMessage = res.error
          }
        }

        toast.error(errorMessage)
      }
    } catch {
      setLoading(false)
      toast.error('Something went wrong while logging in')
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(s => !s)

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          { 'border-ie': settings.skin === 'bordered' }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>

        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign in to start the adventure</Typography>
          </div>

          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Enter your email'
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
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

            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel
                control={
                  <Checkbox checked={isRememberMeChecked} onChange={e => setIsRememberMeChecked(e.target.checked)} />
                }
                label='Remember me'
              />
              <Link href={getLocalizedUrl('/forgot-password', locale)}>
                <Typography className='text-end' color='primary'>
                  Forgot password?
                </Typography>
              </Link>
            </div>

            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>

            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Link href={getLocalizedUrl('/register', locale)}>
                <Typography color='primary'>Create an account</Typography>
              </Link>
            </div>

            {loading && <Loader />}
          </form>
        </div>
      </div>

      {/* Post-login modal */}
      {/* <PostLoginModal
        open={showPostLogin}
        onClose={() => setShowPostLogin(false)}
        onSkip={() => router.replace(getLocalizedUrl('/home', locale))}
        businesses={businesses}
        initialSelected={initialSelected}
        onConfirmSelection={handleConfirmSelection}
      /> */}
    </div>
  )
}

export default Login
