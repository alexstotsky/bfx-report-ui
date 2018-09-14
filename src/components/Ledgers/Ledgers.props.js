import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

const LEDGERS_ENTRIES_PROPS = PropTypes.shape({
  id: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  mts: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
})

export const propTypes = {
  coins: PropTypes.arrayOf(PropTypes.string),
  offset: PropTypes.number.isRequired,
  entries: PropTypes.arrayOf(LEDGERS_ENTRIES_PROPS).isRequired,
  existingCoins: PropTypes.arrayOf(PropTypes.string),
  fetchLedgers: PropTypes.func.isRequired,
  fetchNextLedgers: PropTypes.func.isRequired,
  fetchPrevLedgers: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  jumpPage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageOffset: PropTypes.number.isRequired,
  pageLoading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  setTargetSymbol: PropTypes.func.isRequired,
  targetSymbol: PropTypes.string,
}

export const defaultProps = {
  coins: [],
  offset: 0,
  entries: [],
  existingCoins: [],
  fetchLedgers: () => {},
  fetchNextLedgers: () => {},
  fetchPrevLedgers: () => {},
  intl: {},
  jumpPage: () => {},
  loading: true,
  pageOffset: 0,
  pageLoading: false,
  refresh: () => {},
  setTargetSymbol: () => {},
}
