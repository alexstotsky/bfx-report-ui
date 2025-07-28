import PropTypes from 'prop-types'

export const WALLETS_ENTRIES_PROPS = PropTypes.shape({
  currency: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  unsettledInterest: PropTypes.number,
  balanceAvailable: PropTypes.number,
})

export const propTypes = {
  currentTime: PropTypes.number,
  entries: PropTypes.arrayOf(WALLETS_ENTRIES_PROPS),
  walletsSnapshotEntries: PropTypes.arrayOf(WALLETS_ENTRIES_PROPS),
  exactBalance: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchSnapshots: PropTypes.func.isRequired,
  dataReceived: PropTypes.bool.isRequired,
  isFirstSyncing: PropTypes.bool.isRequired,
  pageLoading: PropTypes.bool.isRequired,
  snapshotLoading: PropTypes.bool.isRequired,
  snapshotReceived: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  setExactBalance: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export const defaultProps = {
  currentTime: null,
  entries: [],
  walletsSnapshotEntries: [],
}
