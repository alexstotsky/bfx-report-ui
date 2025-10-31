import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Intent } from '@blueprintjs/core'
import _map from 'lodash/map'
import _isEqual from 'lodash/isEqual'
import _differenceBy from 'lodash/differenceBy'
import { get, isEmpty } from '@bitfinex/lib-js-util-base'

import Loading from 'ui/Loading'
import { hasValidUsername } from 'components/Auth/SignInList/SignInList.helpers'

import SubUsersAdd from './SubUsersAdd'
import SubUsersList from './SubUsersList'
import { getFilledAccounts, EMPTY_ACCOUNT, USE_API_KEY } from './utils'

class SubAccount extends PureComponent {
  static propTypes = {
    authData: PropTypes.shape({
      email: PropTypes.string,
      isSubAccount: PropTypes.bool,
    }).isRequired,
    addSubAccount: PropTypes.func.isRequired,
    isSubAccountsLoading: PropTypes.bool,
    isMultipleAccsSelected: PropTypes.bool,
    masterAccount: PropTypes.string,
    userPassword: PropTypes.string,
    localUsername: PropTypes.string,
    updateSubAccount: PropTypes.func.isRequired,
    updateLocalUsername: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string.isRequired,
      isSubAccount: PropTypes.bool.isRequired,
      isNotProtected: PropTypes.bool.isRequired,
    })).isRequired,
    allowedUsers: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string.isRequired,
    })),
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    allowedUsers: [],
    localUsername: null,
    masterAccount: undefined,
    userPassword: undefined,
    isSubAccountsLoading: false,
    isMultipleAccsSelected: false,
  }

  state = {
    accounts: [EMPTY_ACCOUNT],
    subUsersToRemove: [],
  }

  createSubAccount = () => {
    const {
      t,
      userPassword,
      addSubAccount,
      localUsername,
      masterAccount,
    } = this.props
    const { accounts } = this.state

    const preparedAccountData = getFilledAccounts(accounts, t).map((account) => {
      const {
        email,
        apiKey,
        password,
        apiSecret,
      } = account

      return !_isEqual(email, t(USE_API_KEY))
        ? { email, password: password || undefined }
        : { apiKey, apiSecret }
    })

    addSubAccount({
      preparedAccountData,
      masterAccount,
      userPassword,
      localUsername,
    })

    this.setState({
      accounts: [EMPTY_ACCOUNT],
    })
  }

  onSubUsersChange = (accounts) => {
    this.setState({ accounts })
  }

  onSubUserToggle = (subUserEmail) => {
    const { subUsersToRemove } = this.state
    this.setState({
      subUsersToRemove: subUsersToRemove.includes(subUserEmail)
        ? subUsersToRemove.filter(email => email !== subUserEmail)
        : [...subUsersToRemove, subUserEmail],
    })
  }

  updateSubAccount = () => {
    const {
      t,
      userPassword,
      masterAccount,
      localUsername,
      updateSubAccount,
      updateLocalUsername,
    } = this.props
    const { accounts, subUsersToRemove } = this.state

    const filledAccounts = getFilledAccounts(accounts, t)
    const preparedAccounts = _map(filledAccounts, account => {
      if (_isEqual(account?.email, t(USE_API_KEY))) {
        return { ...account, email: '' }
      }
      return account
    })

    if (preparedAccounts.length || subUsersToRemove.length) {
      updateSubAccount({
        masterAccount,
        userPassword,
        localUsername,
        addedSubUsers: preparedAccounts,
        removedSubUsers: subUsersToRemove,
      })

      this.setState({
        accounts: [EMPTY_ACCOUNT],
        subUsersToRemove: [],
      })
    } else if (hasValidUsername(localUsername)) {
      updateLocalUsername({ masterAccount, localUsername, userPassword })
    }
  }

  render() {
    const {
      t,
      users,
      authData,
      allowedUsers,
      userPassword,
      masterAccount,
      localUsername,
      isSubAccountsLoading,
      isMultipleAccsSelected,
    } = this.props
    const { accounts, subUsersToRemove } = this.state
    const { email: currentUserEmail, isSubAccount } = authData
    const masterAccountEmail = masterAccount || currentUserEmail
    const subAccountData = users.find((user) => user.email === masterAccountEmail && user.isSubAccount)
    const subUsers = get(subAccountData, 'subUsers', [])
    const hasFilledAccounts = getFilledAccounts(accounts, t).length > 0
      || (hasValidUsername(localUsername) && !isEmpty(subUsers))
    const hasSubAccount = !!users.find(user => user.email === masterAccountEmail && user.isSubAccount)
    const preparedUsers = _differenceBy(allowedUsers, subUsers, 'email')
    const isConfirmDisabled = isEmpty(masterAccountEmail) || (!hasFilledAccounts && isEmpty(subUsersToRemove))

    let showContent
    if (isSubAccountsLoading) {
      showContent = <Loading />
    } else {
      showContent = (
        <>
          {!isEmpty(subUsers) && (
            <SubUsersList
              subUsers={subUsers}
              email={masterAccountEmail}
              password={userPassword}
              onToggle={this.onSubUserToggle}
              subUsersToRemove={subUsersToRemove}
              isRemovalEnabled={masterAccount || isSubAccount}
            />
          )}
          {(masterAccount || (isSubAccount || !hasSubAccount)) && (
            <>
              <SubUsersAdd
                accounts={accounts}
                authData={authData}
                users={preparedUsers}
                addMultipleAccsEnabled
                masterAccount={masterAccount}
                onChange={this.onSubUsersChange}
                shouldFilterCurrentUser={!isMultipleAccsSelected}
              />
              <div className='sub-account-confirm'>
                <Button
                  intent={Intent.SUCCESS}
                  disabled={isConfirmDisabled}
                  className='sub-account-confirm-btn'
                  onClick={isEmpty(subUsers) ? this.createSubAccount : this.updateSubAccount}
                >
                  {isEmpty(subUsers)
                    ? t('subaccounts.add_accounts')
                    : t('subaccounts.update_accounts')}
                </Button>

              </div>
            </>
          )}
        </>
      )
    }

    return (
      <div className='sub-account'>
        {showContent}
      </div>
    )
  }
}

export default SubAccount
