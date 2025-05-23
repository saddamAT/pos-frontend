// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPassword from '@views/ForgotPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'forgot Password',
  description: 'reset your account'
}

const ForgotPasswordPage = () => {
  // Vars
  const mode = getServerMode()

  return <ForgotPassword mode={mode} />
}

export default ForgotPasswordPage
