'use client'

import BusinessModal from '@/components/business/modal/BusinessModal'
import {
  Badge,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Divider,
  Typography,
  Collapse,
  ListItemIcon
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { MouseEvent, TouchEvent } from 'react'
import { ChevronRight, ExpandMore, Check } from '@mui/icons-material'

/** branches/outlets are the same entity; stored under `user_business` on each business */
function getBranches(business: any): any[] {
  return Array.isArray(business?.user_business) ? business.user_business : []
}

export default function CompanyDropdown() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [expandedBusinessId, setExpandedBusinessId] = useState<number | null>(null)

  const [selectedBusinessForModal, setSelectedBusinessForModal] = useState<{
    branches: any[]
    selectedBranchId: number
  } | null>(null)

  const handleExpand = (id: number) => setExpandedBusinessId(prev => (prev === id ? null : id))

  const router = useRouter()
  const { data: session, update } = useSession()

  const user = session?.user
  if (!user) return null

  const userBusinesses = user.userBusinesses || []

  // ✅ Show the selected branch/outlet name from session
  const selectedBranchName = user.selectedOutlet?.name

  const toggleDropdown = () => setOpen(prev => !prev)

  const handleDropdownClose = (event?: MouseEvent<HTMLElement> | TouchEvent, url?: string) => {
    if (url) router.push(url)
    if (anchorRef.current?.contains(event?.target as HTMLElement)) return
    setOpen(false)
  }

  const handleSwitchBusiness = async (event: MouseEvent<HTMLElement> | TouchEvent, selectedBranch: any) => {
    // Find the parent business that contains this branch/outlet
    const parentBusiness = userBusinesses.find(ub => getBranches(ub).some((b: any) => b.id === selectedBranch.id))
    if (!parentBusiness) return

    // ✅ Persist both parent and outlet in session so badge & routing stay correct
    await update({
      selectedBusiness: parentBusiness,
      selectedOutlet: selectedBranch
    })

    handleDropdownClose(event)

    // Open modal with branches for this parent and highlight the chosen one
    setSelectedBusinessForModal({
      branches: getBranches(parentBusiness),
      selectedBranchId: selectedBranch.id
    })
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <span onClick={toggleDropdown} className='cursor-pointer'>
          {selectedBranchName || 'No Business Selected'}
        </span>
      </Badge>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => handleDropdownClose()}>
                <MenuList>
                  <MenuItem disabled tabIndex={-1} sx={{ cursor: 'default' }}>
                    <i className='tabler-building' />
                    <div className='flex flex-col items-start ms-2'>
                      <Typography className='font-medium' color='text.primary'>
                        {selectedBranchName ?? '—'}
                      </Typography>
                      <Typography variant='caption'>{user?.user_type}</Typography>
                    </div>
                  </MenuItem>

                  <Divider className='mlb-1' />

                  {userBusinesses.length > 1 && [
                    <MenuItem disabled key='switch-header'>
                      <Typography variant='overline' className='pli-6 pty-1 ptb-1'>
                        Switch Business
                      </Typography>
                    </MenuItem>,

                    ...userBusinesses.map(ub => {
                      const isExpanded = expandedBusinessId === ub.id
                      const branches = getBranches(ub)

                      return (
                        <div key={ub.id}>
                          <MenuItem onClick={() => handleExpand(ub.id)} className='mli-2 gap-3 justify-between'>
                            <div className='flex gap-2 items-center'>
                              <i className='tabler-building' />
                              <Typography color='text.primary'>{ub.name}</Typography>
                            </div>
                            <div className='flex items-center gap-2'>
                              {isExpanded ? <ExpandMore fontSize='small' /> : <ChevronRight fontSize='small' />}
                            </div>
                          </MenuItem>

                          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                            {branches.map((sub: any) => {
                              const isSelected = user?.selectedOutlet?.id === sub.id
                              return (
                                <MenuItem
                                  key={sub.id}
                                  selected={isSelected}
                                  onClick={e => handleSwitchBusiness(e, sub)}
                                  className='ms-8'
                                >
                                  <ListItemIcon>
                                    <i className='tabler-building' />
                                  </ListItemIcon>
                                  <Typography sx={{ flexGrow: 1 }}>{sub.name}</Typography>
                                  {isSelected && <Check fontSize='small' />}
                                </MenuItem>
                              )
                            })}
                          </Collapse>
                        </div>
                      )
                    }),

                    <Divider key='switch-divider' className='mlb-1' />
                  ]}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {selectedBusinessForModal && (
        <BusinessModal
          onClose={() => setSelectedBusinessForModal(null)}
          branches={selectedBusinessForModal.branches}
          selectedBranchId={selectedBusinessForModal.selectedBranchId}
        />
      )}
    </>
  )
}
