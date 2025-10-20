
'use client'

import { Dialog, DialogTitle, DialogContent, IconButton, Card, CardContent, Box } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import BusinessCard from '@components/business/modal/BusinessCard'
import { BusinessBranchType } from '@/api/interface/businessInterface'

type Props = {
  onClose: () => void
  branches: BusinessBranchType[]
  selectedBranchId: number
}

const BusinessModal = ({ onClose, branches, selectedBranchId }: Props) => {
  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          maxWidth: '40vw'
        }
      }}
    >
      <DialogTitle>
        Business Branches
        <IconButton aria-label='close' onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center'
          }}
        >
          {branches.map(branch => {
            const isSelected = branch.id === selectedBranchId

            return (
              <Card
                key={branch.id}
                sx={{
                  width: 220,
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                <CardContent>
                  <BusinessCard business={branch} />
                </CardContent>

                {isSelected && (
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CheckCircle fontSize='small' color='primary' />
                  </Box>
                )}
              </Card>
            )
          })}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default BusinessModal
