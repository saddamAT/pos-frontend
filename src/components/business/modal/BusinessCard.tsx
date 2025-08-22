'use client'

import { Card, CardContent, Typography } from '@mui/material'
import { BusinessBranchType } from '@/api/interface/businessInterface'

type Props = {
  business: BusinessBranchType
}

const BusinessCard = ({ business }: Props) => {
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return 'No description available.'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <Card
      // variant='outlined'
      sx={{ boxShadow: 'none', borderColor: 'divider' }}
    >
      <CardContent sx={{ p: 0 }}>
        <Typography variant='h6' gutterBottom>
          {business.name || 'Unnamed Branch'}
        </Typography>

        <Typography variant='body2' color='textSecondary'>
          Cuisine Type: {business.cuisine_type || 'N/A'}
        </Typography>

        <Typography variant='body2' sx={{ mt: 1 }}>
          {truncateText(business.description, 20)}
        </Typography>

        <Typography variant='body2' sx={{ mt: 1 }}>
          Postal Code Delivery: {business.postal_code_delivery ?? 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BusinessCard
