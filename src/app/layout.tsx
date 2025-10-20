import 'react-perfect-scrollbar/dist/css/styles.css'
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'
import { i18n } from '@configs/i18n'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'POS Admin Dashboard',
  description:
    'POS Admin Dashboard - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars

  const direction = i18n.langDirection[params.lang]

  return (
    <html id='__next' lang={params.lang} dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
