'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Locale } from '@/configs/i18n'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useAuthStore } from '@/store/authStore'
import { useSession } from 'next-auth/react'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  const { user } = useAuthStore()

  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = useParams() as { lang: Locale }

  const { data } = useSession()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label=''>
          <MenuItem href={`/${locale}/home`} icon={<i className='tabler-smart-home' />}>
            {dictionary['navigation'].home}
          </MenuItem>

          {['superadmin', 'admin'].includes(data?.user?.user_type ?? '') && (
            <MenuItem href={`/${locale}/users`} icon={<i className='tabler-user' />}>
              {dictionary.navigation.users}
            </MenuItem>
          )}

          {data?.user?.user_type === 'superadmin' && (
            <MenuItem href={`/${locale}/business`} icon={<i className='tabler-chart-bar' />}>
              {dictionary['navigation'].business}
            </MenuItem>
          )}
          {data?.user?.user_type?.toLowerCase() !== 'cashier' && data?.user?.user_type?.toLowerCase() !== 'manager' && (
            <MenuItem href={`/${locale}/outlets`} icon={<i className='tabler-box text-[26px]' />}>
              {dictionary['navigation'].outlet}
            </MenuItem>
          )}

          <MenuItem href={`/${locale}/products`} icon={<i className='tabler-list-search' />}>
            {dictionary['navigation'].products}
          </MenuItem>

          <MenuItem href={`/${locale}/orders`} icon={<i className='tabler-shopping-cart' />}>
            {dictionary['navigation'].orders}
          </MenuItem>
          {data?.user?.user_type?.toLowerCase() !== 'cashier' && (
            <MenuItem href={`/${locale}/returns`} icon={<i className='tabler-refresh text-textPrimary' />}>
              {dictionary['navigation'].returns}
            </MenuItem>
          )}

          <MenuItem href={`/${locale}/wa-templates`} icon={<i className='tabler-link text-lg' />}>
            {dictionary['navigation'].templates}
          </MenuItem>

          <SubMenu label={dictionary['navigation'].settings} icon={<i className='tabler-settings' />}>
            <MenuItem href={`/${locale}/account-settings`}>{dictionary['navigation'].accountSettings}</MenuItem>
            <MenuItem href={`/${locale}/pricing`}>{dictionary['navigation'].pricing}</MenuItem>
            <MenuItem href={`/${locale}/invitation`}>{dictionary['navigation'].invitation}</MenuItem>
            <MenuItem href={`/${locale}/billing-plans`}>{dictionary['navigation'].billingAndPlans}</MenuItem>
            <MenuItem href={`/${locale}/notifications`}>{dictionary['navigation'].Notifications}</MenuItem>
            <MenuItem href={`/${locale}/platforms`}>{dictionary['navigation'].Platforms}</MenuItem>
            <MenuItem href={`/${locale}/postal-code`}>{dictionary['navigation'].PostalCodes}</MenuItem>
          </SubMenu>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
