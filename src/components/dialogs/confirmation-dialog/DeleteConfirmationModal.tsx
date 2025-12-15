'use client'

// React Imports
import Button from '@mui/material/Button'
// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
// Third-party Imports
import classnames from 'classnames'
import { Fragment, useState } from 'react'

type ConfirmationType = 'delete-account' | 'unsubscribe' | 'suspend-account' | 'delete'

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
  type: ConfirmationType
}

const ConfirmationDialog = ({ open, setOpen, onConfirm, type }: ConfirmationDialogProps) => {
  // States
  const [secondDialog, setSecondDialog] = useState(false)
  const [userInput, setUserInput] = useState(false)

  // Vars
  const Wrapper = type === 'suspend-account' ? 'div' : Fragment

  const handleSecondDialogClose = (value: boolean) => {
    setSecondDialog(false)
    setOpen(false)
    if (value) {
      onConfirm()
    }
  }
  const handleConfirmation = (value: boolean) => {
    setUserInput(value)
    setSecondDialog(true)

    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={() => setOpen(false)}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <Wrapper
            {...(type === 'suspend-account' && {
              className: 'flex flex-col items-center gap-2'
            })}
          >
            <Typography variant='h4'>
              {type === 'delete-account' && 'Are you sure you want to deactivate your account?'}
              {type === 'unsubscribe' && 'Are you sure to cancel your subscription?'}
              {type === 'suspend-account' && 'Are you sure?'}
              {type === 'delete' && 'Are you sure?'}
            </Typography>
            {type === 'suspend-account' && (
              <Typography color='text.primary'>You won&#39;t be able to revert user!</Typography>
            )}
            {type === 'delete' && <Typography color='text.primary'>You won&#39;t be able to revert!</Typography>}
          </Wrapper>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            onClick={() => handleConfirmation(true)}
            // color='success'
          >
            {type === 'suspend-account' ? 'Yes, Suspend User!' : type === 'delete' ? 'Yes, Delete!' : 'Yes'}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleSecondDialogClose(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={secondDialog}
        onClose={() => {
          handleSecondDialogClose(false)
        }}
      >
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i
            className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check': userInput,
              'text-success': userInput,
              'tabler-circle-x': !userInput,
              'text-error': !userInput
            })}
          />
          <Typography variant='h4' className='mbe-2'>
            {userInput
              ? `${type === 'delete-account' ? 'Deactivated' : type === 'unsubscribe' ? 'Unsubscribed' : type === 'delete' ? 'Deleted' : 'Suspended!'}`
              : 'Cancelled'}
          </Typography>
          <Typography color='text.primary'>
            {userInput ? (
              <>
                {type === 'delete-account' && 'Your account has been deactivated successfully.'}
                {type === 'unsubscribe' && 'Your subscription cancelled successfully.'}
                {type === 'suspend-account' && 'User has been suspended.'}
                {type === 'delete' && 'Deleted successfully.'}
              </>
            ) : (
              <>
                {type === 'delete-account' && 'Account Deactivation Cancelled!'}
                {type === 'unsubscribe' && 'Unsubscription Cancelled!!'}
                {type === 'suspend-account' && 'Cancelled Suspension :)'}
                {type === 'delete' && 'Deletion Cancelled'}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            color='success'
            onClick={() => {
              handleSecondDialogClose(true)
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmationDialog
