import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  refresh,
  setTimestamp,
  fetchWallets,
  setExactBalance,
} from 'state/wallets/actions'
import { fetchSnapshots } from 'state/snapshots/actions'
import {
  getEntries,
  getTimestamp,
  getPageLoading,
  getExactBalance,
  getDataReceived,
} from 'state/wallets/selectors'
import {
  getWalletsEntries,
  getPageLoading as getSnapshotLoading,
  getDataReceived as getSnapshotReceived,
} from 'state/snapshots/selectors'
import { getIsSyncRequired, getIsFirstSyncing } from 'state/sync/selectors'

import Wallets from './Wallets'

const mapStateToProps = state => ({
  entries: getEntries(state),
  currentTime: getTimestamp(state),
  pageLoading: getPageLoading(state),
  dataReceived: getDataReceived(state),
  exactBalance: getExactBalance(state),
  isSyncRequired: getIsSyncRequired(state),
  isFirstSyncing: getIsFirstSyncing(state),
  snapshotLoading: getSnapshotLoading(state),
  snapshotReceived: getSnapshotReceived(state),
  walletsSnapshotEntries: getWalletsEntries(state),
})

const mapDispatchToProps = {
  refresh,
  setTimestamp,
  fetchSnapshots,
  setExactBalance,
  fetchData: fetchWallets,
}

const WalletsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallets))

export default WalletsContainer
