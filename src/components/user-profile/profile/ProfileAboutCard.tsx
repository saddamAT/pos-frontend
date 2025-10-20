'use client'

import { useSession } from 'next-auth/react'

export default function ProfileAboutCard() {
  const { data: session } = useSession()

  return (
    <div className='max-w-sm mx-auto rounded-lg border border-gray-200 bg-white shadow p-6'>
      {/* ABOUT */}
      <div className='mb-6'>
        <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3'>About</h2>
        <ul className='space-y-3 text-gray-700'>
          <li className='flex items-center gap-2'>
            {/* <IconUser size={20} className='text-gray-500' /> */}
            <i className='tabler-user'></i>
            <span>
              <span className='font-medium'>Full Name:</span> {session?.user?.first_name} {''}{' '}
              {session?.user?.last_name}
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <i className='tabler-check'></i>
            <span>
              <span className='font-medium'>Status:</span> {session?.user?.status}
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <i className='tabler-crown'></i>
            <span>
              <span className='font-medium'>Role:</span> {session?.user?.user_type}
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <i className='tabler-map-pin'></i>
            <span>
              <span className='font-medium'>City:</span> {session?.user?.city}
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <i className='tabler-flag'></i>
            <span>
              <span className='font-medium'>Country:</span> {session?.user?.country}
            </span>
          </li>

          <li className='flex items-center gap-2'>
            <i className='tabler-language'></i>
            <span>
              <span className='font-medium'>Language:</span> English
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3'>Contacts</h2>
        <ul className='space-y-3 text-gray-700'>
          <li className='flex items-center gap-2'>
            <i className='tabler-phone'></i>
            <span>
              <span className='font-medium'>Contact:</span> {session?.user?.mobile}
            </span>
          </li>

          <li className='flex items-center gap-2'>
            <i className='tabler-mail'></i>
            <span>
              <span className='font-medium'>Email:</span> {session?.user?.email}
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <i className='tabler-messages'></i>
            <span>
              <span className='font-medium'>Postal Code :</span> {session?.user?.postalCode}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
