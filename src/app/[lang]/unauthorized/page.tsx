'use client'

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center'>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>Access Denied</h1>

        <p className='text-gray-600 mb-6'>You don’t have permission to view this page.</p>

        <Link href='/' className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
          Go Back to Home
        </Link>

        <p className='text-sm text-gray-400 mt-4'>If you believe this is a mistake, contact your administrator.</p>
      </div>
    </div>
  )
}
