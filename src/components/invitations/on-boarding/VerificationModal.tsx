'use client'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import Logo from '@/components/layout/shared/Logo'
import { UserInvitation } from '@/types/apps/userTypes'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

type VerifyUserFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm?: (action: 'yes' | 'no') => void
  invitationRes?: UserInvitation
}

const VerificationModal = ({ open, setOpen, onConfirm, invitationRes }: VerifyUserFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const handleYesClick = () => {
    setLoading(true)
    if (onConfirm) onConfirm('yes')
    setOpen(false)
  }

  console.log(invitationRes, 'invitationRes')

  const handleNoClick = () => {
    if (onConfirm) onConfirm('no')
    setOpen(false)
  }

  return !invitationRes?.email ? (
    <Dialog open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton
        onClick={() => {
          router.push(getLocalizedUrl('/login', locale))
          setOpen(false)
        }}
        disableRipple
      >
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h6' className='flex gap-4 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-20'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <Logo />
        </div>
        Invitation token invalid or already redeemed. {invitationRes?.email} cannot be registered with this company via
        this link.
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'></DialogActions>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h6' className='flex gap-4 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-20'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <Logo />
        </div>
        Welcome to POS! This {invitationRes?.email} is already linked to another company account. Would you like to use
        the same email to register with this company too?
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
          <Button variant='contained' color='success' onClick={handleYesClick} disabled={loading}>
            Yes
          </Button>
          <Button variant='tonal' color='error' onClick={handleNoClick}>
            No, Create New Account
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default VerificationModal
