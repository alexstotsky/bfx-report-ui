import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Menu,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core'
import _isNull from 'lodash/isNull'
import _isString from 'lodash/isString'
import _toString from 'lodash/toString'

import Icon from 'icons'
import config from 'config'
import { tracker } from 'utils/trackers'
import { getAuthData } from 'state/auth/selectors'
import queryConstants from 'state/query/constants'
import { getPath, getIsExportHidden } from 'state/query/utils'

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
  return email.includes('@') ? `${email.split('@')[0]}` : email
}

const AccountMenu = ({
  t,
  email,
  logout,
  history,
  authStatus,
  localUsername,
  togglePrefDialog,
  toggleExportDialog,
  isSubAccsAvailable,
}) => {
  const { pathname } = useLocation()
  const { hasAuthData } = useSelector(getAuthData)
  const showSubAccounts = showFrameworkMode && isSubAccsAvailable

  const onLogout = () => {
    tracker.trackEvent('Logout')
    logout()
  }

  const switchSection = (type) => {
    tracker.trackEvent(type, 'Navigation')
    history.push({ pathname: getPath(type) })
  }

  const toggleDialog = (type, toggler) => {
    tracker.trackEvent(type, 'Navigation')
    toggler()
  }

  const showExport = useMemo(
    () => !getIsExportHidden(pathname),
    [pathname],
  )

  return (
    <div
      className={classNames(
        'account-menu',
        { 'account-menu--no-email': !authStatus || !email },
      )}
    >
      <Popover
        minimal
        disabled={!hasAuthData}
        position={Position.BOTTOM_LEFT}
        content={(
          <div className='account-menu-content'>
            <Menu>
              <MenuItem
                text={t('header.preferences')}
                icon={<Icon.SLIDER_CIRCLE_H />}
                onClick={() => toggleDialog('Preferences', togglePrefDialog)}
              />
              <MenuItem
                onClick={() => switchSection(MENU_LOGINS)}
                icon={<Icon.SIGN_IN />}
                text={t('navItems.loginHistory')}
              />
              {showExport && (
                <MenuItem
                  text={t('download.export')}
                  icon={<Icon.FILE_EXPORT />}
                  className='account-menu-export'
                  onClick={() => toggleDialog('Export', toggleExportDialog)}
                />
              )}
              {showSubAccounts && (
                <MenuItem
                  onClick={() => switchSection(MENU_SUB_ACCOUNTS)}
                  icon={<Icon.USER_CIRCLE />}
                  text={t('navItems.subAccounts')}
                />
              )}
              <MenuItem
                onClick={() => switchSection(MENU_CHANGE_LOGS)}
                icon={<Icon.NOTEBOOK />}
                text={t('navItems.changeLogs')}
              />
              <MenuItem
                onClick={openHelp}
                icon={<Icon.INFO_CIRCLE />}
                text={t('header.help')}
              />
              {showFrameworkMode && (
                <MenuItem
                  className='account-menu-sync'
                  shouldDismissPopover={false}
                  text={<SyncMode />}
                />
              )}
              <MenuItem
                className='account-menu-query'
                shouldDismissPopover={false}
                text={<QueryMode />}
              />
              <MenuItem
                icon={<Icon.SIGN_OUT />}
                text={t('header.logout')}
                onClick={(() => onLogout())}
              />
            </Menu>
          </div>
            )}
        targetTagName='div'
      >
        <div className='account-menu-wrapper'>
          <div className='account-menu-target'>
            <Icon.USER_CIRCLE />
            <span className='account-menu-username'>
              {authStatus ? formatUsername(email, localUsername) : ''}
            </span>
            <Icon.CHEVRON_DOWN />
            <Icon.CHEVRON_UP />
          </div>
        </div>
      </Popover>
    </div>
  )
}

AccountMenu.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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

AccountMenu.defaultProps = {
  localUsername: null,
}

export default memo(AccountMenu)
