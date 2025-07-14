import React, { useMemo, useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Menu,
  Popover,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import _isNull from 'lodash/isNull'
import _includes from 'lodash/includes'
import _isString from 'lodash/isString'
import _toString from 'lodash/toString'

import Icon from 'icons'
import config from 'config'
import { tracker } from 'utils/trackers'
import queryConstants from 'state/query/constants'
import { getAuthData } from 'state/auth/selectors'
import { getPath, getIsExportHidden } from 'state/query/utils'
import { getMenuItemChevron } from 'ui/NavMenu/NavMenu.helpers'

import SyncMode from '../SyncMode'
import QueryMode from '../QueryMode'
import { openHelp } from '../utils'

const { showFrameworkMode } = config
const { MENU_LOGINS, MENU_SUB_ACCOUNTS, MENU_CHANGE_LOGS } = queryConstants

const formatUsername = (email = '', localUsername) => {
  if (!_isNull(localUsername)) {
    return _toString(localUsername)
  }
  if (!_isString(email)) {
    return ''
  }
  return _includes(email, '@') ? `${email.split('@')[0]}` : email
}

const TopNavigation = ({
  t,
  email,
  logout,
  history,
  localUsername,
  togglePrefDialog,
  toggleExportDialog,
  isSubAccsAvailable,
}) => {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { hasAuthData } = useSelector(getAuthData)
  const showSubAccounts = showFrameworkMode && isSubAccsAvailable

  const showExport = useMemo(
    () => !getIsExportHidden(pathname),
    [pathname],
  )

  const togglePopover = (isPopoverOpen) => {
    setIsOpen(isPopoverOpen)
    tracker.trackEvent('Account Menu', 'Navigation')
    const headerBrand = document.getElementsByClassName('header-brand')[0]
    if (isOpen) {
      headerBrand.classList.add('top-navigation--open')
    } else {
      headerBrand.classList.remove('top-navigation--open')
    }
  }

  const onLogout = () => {
    tracker.trackEvent('Logout')
    logout()
  }

  const switchSection = (type) => {
    tracker.trackEvent(type, 'Navigation')
    history.push({ pathname: getPath(type) })
  }

  const classes = classNames('top-navigation', {
    'top-navigation--open': isOpen,
  })

  if (window.innerWidth > 855) {
    return null
  }

  return (
    <div className={classes}>
      <Popover
        minimal
        autoFocus={false}
        disabled={!hasAuthData}
        position={Position.BOTTOM_RIGHT}
        portalClassName='top-navigation-portal'
        onOpening={() => togglePopover(true)}
        onClosing={() => togglePopover(false)}
        content={(
          <div className='top-navigation-content'>
            <Menu>
              <MenuItem
                icon={<Icon.USER_CIRCLE />}
                shouldDismissPopover={false}
                className='bp3-menu-item--account'
                text={formatUsername(email, localUsername)}
              />
              <MenuItem
                text={<SyncMode />}
                shouldDismissPopover={false}
                className={classNames('bp3-menu-item--sync', {
                  'bp3-menu-item--sync--removed': !showFrameworkMode,
                })}
              />
              <MenuItem
                text={<QueryMode />}
                shouldDismissPopover={false}
                className={classNames('bp3-menu-item--query', {
                  'bp3-menu-item--query--disabled': !showFrameworkMode,
                })}
              />
              <MenuItem
                onClick={togglePrefDialog}
                icon={<Icon.SLIDER_CIRCLE_H />}
                text={t('header.preferences')}
              />
              <MenuItem
                icon={<Icon.SIGN_IN />}
                text={t('navItems.loginHistory')}
                onClick={() => switchSection(MENU_LOGINS)}
              />
              {showExport && (
                <MenuItem
                  className='account-menu-export'
                  onClick={toggleExportDialog}
                  icon={<Icon.FILE_EXPORT />}
                  text={t('download.export')}
                />
              )}
              {showSubAccounts && (
                <MenuItem
                  icon={<Icon.USER_CIRCLE />}
                  text={t('navItems.subAccounts')}
                  onClick={() => switchSection(MENU_SUB_ACCOUNTS)}
                />
              )}
              <MenuItem
                icon={<Icon.NOTEBOOK />}
                text={t('navItems.changeLogs')}
                onClick={() => switchSection(MENU_CHANGE_LOGS)}
              />
              <MenuItem
                onClick={openHelp}
                text={t('header.help')}
                icon={<Icon.INFO_CIRCLE />}
              />
              <MenuItem
                icon={<Icon.SIGN_OUT />}
                text={t('header.logout')}
                onClick={onLogout}
              />
            </Menu>
          </div>
          )}
        targetTagName='div'
        popoverClassName='top-navigation-popover'
      >
        <span>
          <Icon.USER_CIRCLE />
          {getMenuItemChevron(isOpen)}
        </span>
      </Popover>
    </div>
  )
}

TopNavigation.propTypes = {
  t: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  togglePrefDialog: PropTypes.func.isRequired,
  toggleExportDialog: PropTypes.func.isRequired,
  isSubAccsAvailable: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  localUsername: PropTypes.string,
}

TopNavigation.defaultProps = {
  localUsername: null,
}

export default memo(TopNavigation)
