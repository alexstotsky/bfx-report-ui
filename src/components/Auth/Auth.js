import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from '@bitfinex/lib-js-util-base'

import config from 'config'
import { tracker } from 'utils/trackers'

import SignUp from './SignUp'
import SignIn from './SignIn'
import RegisterSubAccounts from './RegisterSubAccounts'
import PasswordRecovery from './PasswordRecovery'

const { showFrameworkMode, showAuthPage } = config

export const AUTH_TYPES = {
  SIMPLE_ACCOUNTS: 'simpleAccounts',
  MULTIPLE_ACCOUNTS: 'multipleAccounts',
}

export const MODES = {
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  PASSWORD_RECOVERY: 'password_recovery',
}

class Auth extends PureComponent {
  static propTypes = {
    authData: PropTypes.shape({
      hasAuthData: PropTypes.bool.isRequired,
      isSubAccount: PropTypes.bool.isRequired,
    }).isRequired,
    isShown: PropTypes.bool,
    isUsersLoaded: PropTypes.bool,
    usersLoading: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string,
    })).isRequired,
  }

  static defaultProps = {
    isShown: false,
    usersLoading: false,
    isUsersLoaded: false,
  }

  constructor(props) {
    super()

    const { authData: { hasAuthData, isSubAccount } } = props

    this.state = {
      masterAccount: '',
      localUsername: null,
      mode: (!showFrameworkMode || !hasAuthData) ? MODES.SIGN_UP : MODES.SIGN_IN,
      authType: isSubAccount ? AUTH_TYPES.MULTIPLE_ACCOUNTS : AUTH_TYPES.SIMPLE_ACCOUNTS,
    }
  }

  componentDidUpdate(prevProps) {
    const { authType } = this.state
    const { isUsersLoaded, users } = this.props
    const isMultipleAccsSelected = authType === AUTH_TYPES.MULTIPLE_ACCOUNTS
    if (showFrameworkMode && !prevProps.isUsersLoaded && isUsersLoaded && users.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mode: isMultipleAccsSelected ? MODES.SIGN_UP : MODES.SIGN_IN })
    }
  }

  switchMode = (mode) => {
    tracker.trackEvent(mode, 'Navigation')
    this.setState({ mode })
  }

  switchAuthType = (authType) => {
    tracker.trackEvent(authType, 'Navigation')
    this.setState({ authType })
  }

  setMasterAccount = (email) => {
    this.setState({ masterAccount: email })
  }

  setLocalUsername = (name) => {
    this.setState({ localUsername: name })
  }

  render() {
    const {
      isShown,
      usersLoading,
      authData: { hasAuthData },
    } = this.props
    const {
      mode,
      authType,
      masterAccount,
      localUsername,
    } = this.state
    const isMultipleAccsSelected = (isEqual(authType, AUTH_TYPES.MULTIPLE_ACCOUNTS) && showFrameworkMode)

    if (!isShown || (showFrameworkMode && !hasAuthData && usersLoading) || !showAuthPage) {
      return null
    }

    switch (mode) {
      case isMultipleAccsSelected && MODES.SIGN_UP:
        return (
          <RegisterSubAccounts
            switchMode={this.switchMode}
            masterAccount={masterAccount}
            localUsername={localUsername}
            switchAuthType={this.switchAuthType}
            setMasterAccount={this.setMasterAccount}
            isMultipleAccsSelected={isMultipleAccsSelected}
          />
        )
      case MODES.SIGN_IN:
        return (
          <SignIn
            authType={authType}
            switchMode={this.switchMode}
            switchAuthType={this.switchAuthType}
            setLocalUsername={this.setLocalUsername}
            setMasterAccount={this.setMasterAccount}
            isMultipleAccsSelected={isMultipleAccsSelected}
          />
        )
      case MODES.SIGN_UP:
      default:
        return (
          <SignUp switchMode={this.switchMode} />
        )
      case MODES.PASSWORD_RECOVERY:
        return <PasswordRecovery switchMode={this.switchMode} />
    }
  }
}

export default Auth
