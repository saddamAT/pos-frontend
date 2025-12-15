// 'use client'

// import { Card, CardContent, Typography } from '@mui/material'
// import { BusinessBranchType } from '@/api/interface/businessInterface'

// type Props = {
//   business: BusinessBranchType
// }

// const BusinessCard = ({ business }: Props) => {
//   const truncateText = (text: string | undefined, maxLength: number) => {
//     if (!text) return 'No description available.'
//     return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
//   }

//   return (
//     <Card
//       // variant='outlined'
//       sx={{ boxShadow: 'none', borderColor: 'divider' }}
//     >
//       <CardContent sx={{ p: 0 }}>
//         <Typography variant='h6' gutterBottom>
//           {business.name || 'Unnamed Branch'}
//         </Typography>

//         <Typography variant='body2' color='textSecondary'>
//           Cuisine Type: {business.cuisine_type || 'N/A'}
//         </Typography>

//         <Typography variant='body2' sx={{ mt: 1 }}>
//           {truncateText(business.description, 20)}
//         </Typography>

//         <Typography variant='body2' sx={{ mt: 1 }}>
//           Postal Code Delivery: {business.postal_code_delivery ?? 'N/A'}
//         </Typography>
//       </CardContent>
//     </Card>
//   )
// }

// export default BusinessCard

// second code

// 'use client'

// import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
// import { BusinessBranchType } from '@/api/interface/businessInterface'
// import { LocationOn, Restaurant } from '@mui/icons-material'

// type Props = {
//   business: BusinessBranchType
//   isSelected?: boolean
//   onClick?: () => void
// }

// const BusinessCard = ({ business, isSelected = false, onClick }: Props) => {
//   const truncateText = (text: string | undefined, maxLength: number) => {
//     if (!text) return 'No description available.'
//     return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
//   }

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Header with branch name */}
//       <Box sx={{ mb: 1 }}>
//         <Typography
//           variant='h6'
//           sx={{
//             fontWeight: isSelected ? 600 : 500,
//             color: isSelected ? 'primary.main' : 'text.primary',
//             fontSize: '1rem',
//             lineHeight: 1.2
//           }}
//         >
//           {business.name || 'Unnamed Branch'}
//         </Typography>
//         {business.active && (
//           <Chip
//             size='small'
//             label='Active'
//             color='success'
//             variant='outlined'
//             sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
//           />
//         )}
//       </Box>

//       {/* Cuisine type with icon */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
//         <Restaurant sx={{ fontSize: 16, color: 'text.secondary' }} />
//         <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.8rem' }}>
//           {business.cuisine_type || 'N/A'}
//         </Typography>
//       </Box>

//       {/* Description */}
//       <Typography
//         variant='body2'
//         sx={{
//           mb: 1,
//           fontSize: '0.8rem',
//           color: 'text.secondary',
//           lineHeight: 1.3,
//           flex: 1
//         }}
//       >
//         {truncateText(business.description, 60)}
//       </Typography>

//       {/* Delivery info with icon */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto' }}>
//         <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
//         <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
//           {business.postal_code_delivery ?? 'No delivery area set'}
//         </Typography>
//       </Box>

//       {/* City if available */}
//       {business.city && (
//         <Typography variant='caption' sx={{ mt: 0.5, color: 'text.disabled' }}>
//           {business.city}
//         </Typography>
//       )}
//     </Box>
//   )
// }

// export default BusinessCard

// third code

// 'use client'

// import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
// import { BusinessBranchType } from '@/api/interface/businessInterface'
// import { LocationOn, Restaurant } from '@mui/icons-material'

// type Props = {
//   business: BusinessBranchType
//   isSelected?: boolean
//   onClick?: () => void
// }

// const BusinessCard = ({ business, isSelected = false, onClick }: Props) => {
//   const truncateText = (text: string | undefined, maxLength: number) => {
//     if (!text) return 'No description available.'
//     return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
//   }

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Header with branch name */}
//       <Box sx={{ mb: 1 }}>
//         <Typography
//           variant='h6'
//           sx={{
//             fontWeight: isSelected ? 600 : 500,
//             color: isSelected ? 'primary.main' : 'text.primary',
//             fontSize: '1rem',
//             lineHeight: 1.2
//           }}
//         >
//           {business.name || 'Unnamed Branch'}
//         </Typography>
//         {business.active && (
//           <Chip
//             size='small'
//             label='Active'
//             color='success'
//             variant='outlined'
//             sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
//           />
//         )}
//       </Box>

//       {/* Cuisine type with icon */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
//         <Restaurant sx={{ fontSize: 16, color: 'text.secondary' }} />
//         <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.8rem' }}>
//           {business.cuisine_type || 'N/A'}
//         </Typography>
//       </Box>

//       {/* Description */}
//       <Typography
//         variant='body2'
//         sx={{
//           mb: 1,
//           fontSize: '0.8rem',
//           color: 'text.secondary',
//           lineHeight: 1.3,
//           flex: 1
//         }}
//       >
//         {truncateText(business.description, 60)}
//       </Typography>

//       {/* Delivery info with icon */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto' }}>
//         <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
//         <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
//           {business.postal_code_delivery ?? 'No delivery area set'}
//         </Typography>
//       </Box>

//       {/* City if available */}
//       {business.city && (
//         <Typography variant='caption' sx={{ mt: 0.5, color: 'text.disabled' }}>
//           {business.city}
//         </Typography>
//       )}
//     </Box>
//   )
// }

// export default BusinessCard

// 4th code

'use client'

import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { BusinessBranchType } from '@/api/interface/businessInterface'
import { LocationOn, Restaurant } from '@mui/icons-material'

type Props = {
  business: BusinessBranchType
  isSelected?: boolean
  onClick?: () => void
 
}

const BusinessCard = ({ business, isSelected = false, onClick }: Props) => {
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return 'No description available.'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }
 
  

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={onClick}>
      {/* Header with branch name */}
    
      <Box sx={{ mb: 1 }}>
        <Typography
          variant='h6'
          sx={{
            fontWeight: isSelected ? 600 : 500,
            color: isSelected ? 'primary.main' : 'text.primary',
            fontSize: '1rem',
            lineHeight: 1.2
          }}
        >
          {business.name || 'Unnamed Branch'}
        </Typography>
        {business.active && (
          <Chip
            size='small'
            label='Active'
            color='success'
            variant='outlined'
            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
          />
        )}
      </Box>

      {/* Cuisine type with icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
        <Restaurant sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.8rem' }}>
          {business.cuisine_type || 'N/A'}
        </Typography>
      </Box>

      {/* Description */}
      <Typography
        variant='body2'
        sx={{
          mb: 1,
          fontSize: '0.8rem',
          color: 'text.secondary',
          lineHeight: 1.3,
          flex: 1
        }}
      >
        {truncateText(business.description, 60)}
      </Typography>

      {/* Delivery info with icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto' }}>
        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {business.postal_code_delivery ?? 'No delivery area set'}
        </Typography>
      </Box>

      {/* City if available */}
      {business.city && (
        <Typography variant='caption' sx={{ mt: 0.5, color: 'text.disabled' }}>
          {business.city}
        </Typography>
      )}
    </Box>
  )
}

export default BusinessCard
