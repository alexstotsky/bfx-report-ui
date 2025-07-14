import { connect } from 'react-redux'

import { getIsTurkishSite } from 'state/base/selectors'
import { getIsErrorDialogDisabled } from 'state/ui/selectors'
import {
  getAuthStatus, getIsShown, getIsSubAccsAvailable, getIsUserMerchant,
} from 'state/auth/selectors'

import Main from './Main'

const mapStateToProps = state => ({
  authIsShown: getIsShown(state),
  authStatus: getAuthStatus(state),
  isTurkishSite: getIsTurkishSite(state),
  isUserMerchant: getIsUserMerchant(state),
  isSubAccsAvailable: getIsSubAccsAvailable(state),
  errorDialogDisabled: getIsErrorDialogDisabled(state),
})

const MainContainer = connect(mapStateToProps)(Main)

export default MainContainer
