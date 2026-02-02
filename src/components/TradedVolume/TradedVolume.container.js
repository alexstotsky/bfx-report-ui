import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  fetchTradedVolume,
  addTargetPair,
  removeTargetPair,
  setTargetPairs,
  setParams,
  clearTargetPairs,
} from 'state/tradedVolume/actions'
import {
  getCurrentFetchParams,
  getDataReceived,
  getEntries,
  getPageLoading,
  getParams,
  getTargetPairs,
} from 'state/tradedVolume/selectors'
import {
  getIsFirstSyncing,
  getIsSyncRequired,
  getShouldRefreshAfterSync,
} from 'state/sync/selectors'
import { setShouldRefreshAfterSync } from 'state/sync/actions'
import { getIsTimeframeMoreThanYear } from 'state/timeRange/selectors'

import TradedVolume from './TradedVolume'

const mapStateToProps = state => ({
  currentFetchParams: getCurrentFetchParams(state),
  entries: getEntries(state),
  params: getParams(state),
  targetPairs: getTargetPairs(state),
  dataReceived: getDataReceived(state),
  pageLoading: getPageLoading(state),
  isSyncRequired: getIsSyncRequired(state),
  isFirstSyncing: getIsFirstSyncing(state),
  shouldShowYear: getIsTimeframeMoreThanYear(state),
  shouldRefreshAfterSync: getShouldRefreshAfterSync(state),
})

const mapDispatchToProps = {
  fetchData: fetchTradedVolume,
  setParams,
  addTargetPair,
  setTargetPairs,
  removeTargetPair,
  clearTargetPairs,
  setShouldRefreshAfterSync,
}

const TradedVolumeContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(TradedVolume))

export default TradedVolumeContainer
