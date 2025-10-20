import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'

interface UpdateConfirmationDialogProps {
  openConfirmation: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const UpdateConfirmationDialog: React.FC<UpdateConfirmationDialogProps> = ({
  openConfirmation,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Yes, Update',
  cancelText = 'Cancel'
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={openConfirmation}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <Typography variant='h4'>{title}</Typography>
        <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
        <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button onClick={handleConfirm} variant='contained' color='primary' disableElevation autoFocus>
          {confirmText}
        </Button>
        <Button onClick={onClose} variant='tonal' color='secondary' disableElevation>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateConfirmationDialog
