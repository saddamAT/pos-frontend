'use client'

import * as React from 'react'

// MUI
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CardContent from '@mui/material/CardContent'
import BusinessCard from './BusinessCard'
import { CheckCircle } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export type Outlet = {
  id: number
  name: string
  active: boolean
  business: number
  catalog_link: string
  city?: string
  cuisine_type?: string
  description?: string
  postal_code_delivery?: string
  created_at?: string
  updated_at?: string
  contact_number?: string
  menu?: string | null
}

export type UserBusiness = {
  id: number
  name: string
  business_id: string
  business_desc?: string
  business_address?: string
  business_doc?: string
  business_initial?: string
  business_type?: string
  contact_number?: string
  currency?: number
  logo?: string
  user?: number
  created_at?: string
  updated_at?: string
  user_business?: Outlet[] // outlets / branches
}

export type PostLoginCard = {
  id: string
  title: string
  subtitle?: string
  cta: string
  icon?: string // e.g. 'tabler-layout-dashboard'
  onClick?: () => void
}

type PostLoginModalProps = {
  open: boolean
  onClose: () => void
  onSkip: () => void
  title?: string

  // pass businesses to show a quick "branch picker"
  businesses?: UserBusiness[]

  // initial selection (optional)
  initialSelected?: { businessId?: number | null; outletId?: number | null }

  // called when user hits "Continue" with a selection (if any)
  onConfirmSelection?: (sel: { businessId: number | null; outletId: number | null }) => void
}

export default function PostLoginModal({
  open,
  onClose,
  onSkip,
  title = 'Welcome',
  businesses = [],
  initialSelected,
  onConfirmSelection
}: PostLoginModalProps) {
  const { data: session, update } = useSession()
  const userBusinessesExistence = session?.user?.userBusinesses
  const [isDefaultSelection, setIsDefaultSelection] = React.useState(true)
  const router = useRouter()

  // helper: find the parent business id for a given outlet id
  const findParentBusinessId = React.useCallback(
    (outletId: number | null | undefined) => {
      if (!outletId) return null
      for (const b of businesses) {
        if ((b.user_business ?? []).some(ob => ob.id === outletId)) {
          return b.id
        }
      }
      return null
    },
    [businesses]
  )

  // first business that has at least one outlet
  const firstBizWithOutlet = React.useMemo(
    () => businesses.find(b => (b.user_business?.length ?? 0) > 0) || null,
    [businesses]
  )

  const firstBranch = React.useMemo(() => {
    if (!firstBizWithOutlet) return null
    const arr = firstBizWithOutlet.user_business ?? []
    return arr.length > 0 ? arr[0] : null
  }, [firstBizWithOutlet])

  // ✅ default selection precedence:
  // 1) explicit initialSelected if provided
  // 2) session.user.selectedOutlet (and we derive its parent business)
  // 3) first outlet of first business with outlets
  const getDefaultSelection = React.useMemo(() => {
    // 1) explicit
    if (initialSelected?.businessId && initialSelected?.outletId) {
      return {
        businessId: initialSelected.businessId,
        outletId: initialSelected.outletId
      }
    }

    // 2) from session
    const selectedOutletFromSession = (session?.user as any)?.selectedOutlet
    if (selectedOutletFromSession?.id) {
      const parentBizId = findParentBusinessId(selectedOutletFromSession.id as number)
      return {
        businessId: parentBizId,
        outletId: selectedOutletFromSession.id as number
      }
    }

    // 3) first available
    if (firstBizWithOutlet && firstBranch) {
      return {
        businessId: firstBizWithOutlet.id,
        outletId: firstBranch.id
      }
    }

    return { businessId: null, outletId: null }
  }, [initialSelected, session?.user, businesses, firstBizWithOutlet, firstBranch, findParentBusinessId])

  const [selectedBusinessId, setSelectedBusinessId] = React.useState<number | null>(getDefaultSelection.businessId)
  const [selectedOutletId, setSelectedOutletId] = React.useState<number | null>(getDefaultSelection.outletId)

  // When modal opens or businesses change, ensure a default selection
  // and write it to session if none exists there yet
  React.useEffect(() => {
    if (!open) return

    // set local defaults
    setSelectedBusinessId(getDefaultSelection.businessId)
    setSelectedOutletId(getDefaultSelection.outletId)

    // if nothing in session yet, select first outlet of first business and store in session
    const selectedOutletFromSession = (session?.user as any)?.selectedOutlet
    if (!selectedOutletFromSession?.id && firstBizWithOutlet && firstBranch) {
      // persist BOTH the parent business and the outlet to session
      update({ selectedBusiness: firstBizWithOutlet, selectedOutlet: firstBranch })
    }
  }, [open, getDefaultSelection, firstBranch, firstBizWithOutlet, session?.user, update])

  const hasAnyOutlet = React.useMemo(() => businesses.some(b => (b.user_business?.length ?? 0) > 0), [businesses])

  const handleOutletClick = (businessId: number, outlet: Outlet) => {
    setSelectedBusinessId(businessId)
    setSelectedOutletId(outlet.id)

    // check if clicked outlet matches default selection
    const defaultSel = getDefaultSelection
    const isDefault = defaultSel.businessId === businessId && defaultSel.outletId === outlet.id
    setIsDefaultSelection(isDefault)

    const parentBusiness = businesses.find(b => b.id === businessId)
    if (!parentBusiness) return

    update({ selectedBusiness: parentBusiness, selectedOutlet: outlet })
  }

  const handleContinue = () => {
    if (onConfirmSelection) {
      onConfirmSelection({
        businessId: selectedBusinessId,
        outletId: selectedOutletId
      })
    } else {
      onSkip()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // maxWidth='md'
      // fullWidth
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 2 }}>
        <DialogTitle sx={{ p: 2 }}>
          {title} {''}
          {session?.user?.first_name} {session?.user?.last_name} ! 🎉
        </DialogTitle>
        {session?.user?.user_type === 'superadmin' && (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button variant='contained' onClick={e => router.push('/en/business')}>
              Create Business
            </Button>
            {(userBusinessesExistence?.length ?? 0) > 0 && (
              <Button variant='contained' onClick={e => router.push('/en/outlets')}>
                Create Outlet
              </Button>
            )}
          </Box>
        )}
      </Box>

      <DialogContent dividers>
        {businesses.length > 0 ? (
          <div>
            {!hasAnyOutlet ? (
              <Typography color='text.secondary'>No branches found for your businesses yet.</Typography>
            ) : (
              <>
                {businesses.map(biz => (
                  <Accordion
                    key={biz.id}
                    defaultExpanded={biz.id === selectedBusinessId || biz.id === firstBizWithOutlet?.id}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className='mr-3'>{biz.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {(biz.user_business ?? []).length === 0 ? (
                        <Typography color='text.secondary'>No branches.</Typography>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2
                          }}
                        >
                          {(biz.user_business ?? []).map(outlet => {
                            const isSelected = outlet.id === selectedOutletId && biz.id === selectedBusinessId
                            return (
                              <Card
                                key={outlet.id}
                                onClick={() => handleOutletClick(biz.id, outlet)}
                                sx={{
                                  width: 220,
                                  position: 'relative',
                                  flexShrink: 0,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  }
                                }}
                              >
                                <CardContent>
                                  <BusinessCard business={outlet as any} />
                                </CardContent>
                                {isSelected && isDefaultSelection && (
                                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <CheckCircle fontSize='small' color='primary' />
                                  </Box>
                                )}
                              </Card>
                            )
                          })}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
          </div>
        ) : (
          <Typography color='text.secondary'>
            {session?.user?.user_type === 'superadmin'
              ? 'No businesses yet—let’s add your first one.'
              : 'It looks like you dont have any businesses yet. To create a new business or outlet, please contact your Superadmin for assistance in setting it up. Once your business is created, you will be able to manage it seamlessly. Thank you!'}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isDefaultSelection && (
          <Button onClick={onSkip} variant='text' className='mt-3'>
            Skip &amp; Continue
          </Button>
        )}

        {!isDefaultSelection && (
          <Button onClick={handleContinue} variant='contained' disabled={!selectedOutletId} className='mt-3'>
            Continue {selectedOutletId && 'with Selected Branch'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
