import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

import { fetchWallets, refresh, setTimestamp } from 'state/wallets/actions'
import {
  getEntries,
  getTimestamp,
  getPageLoading,
  getDataReceived,
} from 'state/wallets/selectors'
import { getIsSyncRequired, getIsFirstSyncing } from 'state/sync/selectors'

import ConcentrationRisk from './ConcentrationRisk'

const mapStateToProps = state => ({
  entries: getEntries(state),
  currentTime: getTimestamp(state),
  pageLoading: getPageLoading(state),
  dataReceived: getDataReceived(state),
  isSyncRequired: getIsSyncRequired(state),
  isFirstSyncing: getIsFirstSyncing(state),
})

const mapDispatchToProps = {
  refresh,
  fetchWallets,
  setTimestamp,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation('translations'),
  withRouter,
)(ConcentrationRisk)
