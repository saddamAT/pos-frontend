'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Typography } from '@mui/material'
import { getUserInvitation } from '@/api/invitations'
import Invitations from '@/components/invitations/list/InvitationsTableList'
import { UserInvitation } from '@/api/interface/userInterface'

const InvitationsClient = () => {
  const { data: session } = useSession()
  const selectedBusinessId = session?.user?.selectedBusiness?.id

  const [data, setData] = useState<UserInvitation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedBusinessId) return

    let isMounted = true

    const fetchInvitations = async () => {
      setLoading(true)
      try {
        const res = await getUserInvitation(selectedBusinessId)
        if (isMounted && res?.success) {
          setData(res.data?.results ?? [])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInvitations()

    return () => {
      isMounted = false
    }
  }, [selectedBusinessId])

  if (loading) return <Typography>Loading invitations…</Typography>

  return <Invitations invitationData={data} />
}

export default InvitationsClient
