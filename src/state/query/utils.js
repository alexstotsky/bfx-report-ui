import _isArray from 'lodash/isArray'
import _includes from 'lodash/includes'

import Icons from 'icons'
import config from 'config'

import queryType from './constants'

const { showFrameworkMode } = config

const {
  FILTER_ID,
  FILTER_PAIR,
  FILTER_SYMBOL,
  MENU_ACCOUNT_BALANCE,
  MENU_ACCOUNT_SUMMARY,
  MENU_AFFILIATES_EARNINGS,
  MENU_CANDLES,
  MENU_CHANGE_LOGS,
  MENU_CONCENTRATION_RISK,
  MENU_DERIVATIVES,
  MENU_FCREDIT,
  MENU_FEES_REPORT,
  MENU_FLOAN,
  MENU_FOFFER,
  MENU_FPAYMENT,
  MENU_INVOICES,
  MENU_LEDGERS,
  MENU_LOAN_REPORT,
  MENU_LOGINS,
  MENU_MOVEMENTS,
  MENU_ORDERS,
  MENU_ORDER_TRADES,
  MENU_POSITIONS,
  MENU_POSITIONS_ACTIVE,
  MENU_POSITIONS_AUDIT,
  MENU_PUBLIC_FUNDING,
  MENU_PUBLIC_TRADES,
  MENU_SNAPSHOTS,
  MENU_SPAYMENTS,
  MENU_SUB_ACCOUNTS,
  MENU_TAX_REPORT,
  MENU_TICKERS,
  MENU_TRADED_VOLUME,
  MENU_TRADES,
  MENU_WALLETS,
  MENU_WEIGHTED_AVERAGES,
  MENU_WIN_LOSS,
} = queryType

export const TYPE_WHITELIST = [
  MENU_ACCOUNT_BALANCE,
  MENU_ACCOUNT_SUMMARY,
  MENU_AFFILIATES_EARNINGS,
  MENU_CANDLES,
  MENU_CHANGE_LOGS,
  MENU_CONCENTRATION_RISK,
  MENU_DERIVATIVES,
  MENU_FCREDIT,
  MENU_FEES_REPORT,
  MENU_FLOAN,
  MENU_FOFFER,
  MENU_FPAYMENT,
  MENU_INVOICES,
  MENU_LEDGERS,
  MENU_LOAN_REPORT,
  MENU_LOGINS,
  MENU_MOVEMENTS,
  MENU_ORDERS,
  MENU_ORDER_TRADES,
  MENU_POSITIONS,
  MENU_POSITIONS_ACTIVE,
  MENU_POSITIONS_AUDIT,
  MENU_PUBLIC_FUNDING,
  MENU_PUBLIC_TRADES,
  MENU_SNAPSHOTS,
  MENU_SPAYMENTS,
  MENU_SUB_ACCOUNTS,
  MENU_TAX_REPORT,
  MENU_TICKERS,
  MENU_TRADED_VOLUME,
  MENU_TRADES,
  MENU_WALLETS,
  MENU_WEIGHTED_AVERAGES,
  MENU_WIN_LOSS,
]

export const ROUTE_WHITELIST = [
  MENU_ACCOUNT_BALANCE,
  MENU_ACCOUNT_SUMMARY,
  MENU_AFFILIATES_EARNINGS,
  MENU_CANDLES,
  MENU_CHANGE_LOGS,
  MENU_CONCENTRATION_RISK,
  MENU_DERIVATIVES,
  MENU_FCREDIT,
  MENU_FEES_REPORT,
  MENU_FLOAN,
  MENU_FOFFER,
  MENU_FPAYMENT,
  MENU_INVOICES,
  MENU_LEDGERS,
  MENU_LOAN_REPORT,
  MENU_LOGINS,
  MENU_MOVEMENTS,
  MENU_ORDERS,
  MENU_ORDER_TRADES,
  MENU_POSITIONS,
  MENU_POSITIONS_ACTIVE,
  MENU_POSITIONS_AUDIT,
  MENU_PUBLIC_FUNDING,
  MENU_PUBLIC_TRADES,
  MENU_SNAPSHOTS,
  MENU_SPAYMENTS,
  MENU_SUB_ACCOUNTS,
  MENU_TAX_REPORT,
  MENU_TICKERS,
  MENU_TRADES,
  MENU_TRADED_VOLUME,
  MENU_WALLETS,
  MENU_WEIGHTED_AVERAGES,
  MENU_WIN_LOSS,
]

export const FILTERS_WHITELIST = [
  MENU_LEDGERS,
  MENU_INVOICES,
  MENU_TRADES,
  MENU_ORDERS,
  MENU_MOVEMENTS,
  MENU_POSITIONS,
  MENU_FOFFER,
  MENU_FLOAN,
  MENU_FCREDIT,
  MENU_FPAYMENT,
  MENU_AFFILIATES_EARNINGS,
  MENU_PUBLIC_TRADES,
  MENU_PUBLIC_FUNDING,
  MENU_SPAYMENTS,
  MENU_TICKERS,
  MENU_DERIVATIVES,
  MENU_LOGINS,
  MENU_CHANGE_LOGS,
  MENU_WEIGHTED_AVERAGES,
]

// Should keep the order, which used in ExportTargetsSelector
const BASIC_TARGETS = [
  MENU_LEDGERS,
  MENU_INVOICES,
  MENU_TRADES,
  MENU_ORDERS,
  // MENU_ORDER_TRADES, // needs specific id
  MENU_MOVEMENTS,
  MENU_POSITIONS,
  MENU_POSITIONS_ACTIVE,
  // MENU_POSITIONS_AUDIT, // needs specific id
  MENU_WALLETS,
]

const FUNDING_TARGETS = [
  MENU_FOFFER,
  MENU_FLOAN,
  MENU_FCREDIT,
  MENU_FPAYMENT,
  MENU_SPAYMENTS,
  MENU_AFFILIATES_EARNINGS,
]

const PUBLIC_TARGETS = [
  MENU_PUBLIC_TRADES,
  MENU_PUBLIC_FUNDING,
  MENU_TICKERS,
  MENU_DERIVATIVES,
  MENU_WEIGHTED_AVERAGES,
]

const FRAMEWORK = showFrameworkMode
  ? [
    MENU_ACCOUNT_BALANCE,
    MENU_LOAN_REPORT,
    MENU_TRADED_VOLUME,
    MENU_FEES_REPORT,
    MENU_WIN_LOSS,
    MENU_SNAPSHOTS,
    MENU_TAX_REPORT,
  ]
  : []

export const EXPORT_TARGETS = [
  ...BASIC_TARGETS,
  ...FUNDING_TARGETS,
  ...PUBLIC_TARGETS,
  ...FRAMEWORK,
  MENU_LOGINS,
  MENU_CHANGE_LOGS,
]

export const NO_EXPORT_TARGETS = [
  MENU_ACCOUNT_SUMMARY,
]

export const NO_QUERY_LIMIT_TARGETS = [
  MENU_ORDER_TRADES,
  MENU_DERIVATIVES,
  MENU_WALLETS,
  MENU_SNAPSHOTS,
  MENU_ACCOUNT_BALANCE,
  MENU_LOAN_REPORT,
  MENU_TRADED_VOLUME,
  MENU_FEES_REPORT,
  MENU_WEIGHTED_AVERAGES,
  MENU_WIN_LOSS,
  MENU_POSITIONS_ACTIVE,
]

export const NO_TIME_FRAME_TARGETS = [
  MENU_DERIVATIVES,
  MENU_WALLETS,
  MENU_SNAPSHOTS,
  MENU_POSITIONS_ACTIVE,
]

export function isValidTimeStamp(n) {
  return (`${n}`).length === 13
    && (new Date(n)).getTime() === n
}

/*
 * Mapping of each page's metadata
 * The queryLimit / pageSize MUST be divisible
 */
const MAPPING = {
  [MENU_ACCOUNT_BALANCE]: {
    icon: Icons.ACCOUNT_BALANCE,
    path: '/account_balance',
  },
  [MENU_ACCOUNT_SUMMARY]: {
    icon: Icons.FILE_TABLE,
    path: ['/account_summary', '/'],
  },
  [MENU_CANDLES]: {
    icon: Icons.LOOP,
    path: '/candles',
    queryLimit: 500,
  },
  [MENU_CHANGE_LOGS]: {
    icon: Icons.NOTEBOOK,
    path: '/change_logs',
    queryLimit: 200,
    pageSize: 100,
  },
  [MENU_CONCENTRATION_RISK]: {
    icon: Icons.DISK,
    path: '/concentration_risk',
  },
  [MENU_DERIVATIVES]: {
    icon: Icons.DERIVATIVES,
    filterType: FILTER_PAIR,
    path: '/derivatives',
  },
  [MENU_WEIGHTED_AVERAGES]: {
    icon: Icons.NOTEBOOK,
    filterType: FILTER_PAIR,
    path: '/weighted_averages',
  },
  [MENU_FCREDIT]: {
    icon: Icons.NOTEBOOK,
    path: '/credits',
    filterType: FILTER_SYMBOL,
    queryLimit: 500,
    pageSize: 125,
  },
  [MENU_FEES_REPORT]: {
    icon: Icons.FILE_TABLE,
    path: '/fees_report',
  },
  [MENU_FLOAN]: {
    icon: Icons.NOTEBOOK,
    path: '/loans',
    filterType: FILTER_SYMBOL,
    queryLimit: 500,
    pageSize: 125,
  },
  [MENU_FOFFER]: {
    icon: Icons.NOTEBOOK,
    path: '/offers',
    filterType: FILTER_SYMBOL,
    queryLimit: 500,
    pageSize: 125,
  },
  [MENU_FPAYMENT]: {
    icon: Icons.NOTEBOOK,
    path: '/payments',
    filterType: FILTER_SYMBOL,
    // queryLimit: 500,
    pageSize: 125,
  },
  [MENU_SPAYMENTS]: {
    icon: Icons.NOTEBOOK,
    path: '/staking',
    filterType: FILTER_SYMBOL,
    // queryLimit: 500,
    pageSize: 125,
  },
  [MENU_AFFILIATES_EARNINGS]: {
    icon: Icons.NOTEBOOK,
    path: '/affiliates',
    filterType: FILTER_SYMBOL,
    // queryLimit: 500,
    pageSize: 125,
  },
  [MENU_LEDGERS]: {
    icon: Icons.NOTEBOOK,
    path: '/ledgers',
    filterType: FILTER_SYMBOL,
    // queryLimit: 500,
    pageSize: 125,
  },
  [MENU_INVOICES]: {
    icon: Icons.NOTEBOOK,
    path: '/invoices',
    filterType: FILTER_SYMBOL,
    pageSize: 125,
  },
  [MENU_LOAN_REPORT]: {
    icon: Icons.STICKY_NOTES,
    path: '/loan_report',
  },
  [MENU_LOGINS]: {
    icon: Icons.SIGN_IN,
    path: '/logins',
    queryLimit: 50, // 250 maximum
    pageSize: 50,
  },
  [MENU_ORDERS]: {
    icon: Icons.ORDERS,
    path: '/orders',
    filterType: FILTER_PAIR,
    // queryLimit: 500,
    pageSize: 125,
  },
  [MENU_ORDER_TRADES]: {
    icon: Icons.ORDERS,
    path: '/order_trades',
    filterType: FILTER_ID,
  },
  [MENU_TICKERS]: {
    icon: Icons.TICKERS,
    path: '/tickers',
    filterType: FILTER_PAIR,
    queryLimit: 250,
    pageSize: 125,
  },
  [MENU_TRADES]: {
    icon: Icons.LOOP,
    path: '/trades',
    filterType: FILTER_PAIR,
    // queryLimit: 1000,
    pageSize: 125,
  },
  [MENU_MOVEMENTS]: {
    icon: Icons.MOVEMENTS,
    path: '/movements',
    filterType: FILTER_SYMBOL,
    queryLimit: 25,
    pageSize: 25,
  },
  [MENU_WIN_LOSS]: {
    icon: Icons.SLIDER_CIRCLE_H,
    path: '/average_win_loss',
  },
  [MENU_PUBLIC_FUNDING]: {
    icon: Icons.LOOP,
    path: '/pub_trades_funding',
    filterType: FILTER_SYMBOL,
    queryLimit: 5000,
    pageSize: 125,
  },
  [MENU_PUBLIC_TRADES]: {
    icon: Icons.LOOP,
    path: '/pub_trades',
    filterType: FILTER_PAIR,
    queryLimit: 5000,
    pageSize: 125,
  },
  [MENU_POSITIONS]: {
    icon: Icons.LIST_NUMBER,
    path: '/positions',
    filterType: FILTER_PAIR,
    queryLimit: 50,
    pageSize: 25,
  },
  [MENU_POSITIONS_ACTIVE]: {
    icon: Icons.LIST_NUMBER,
    path: '/activepositions',
    filterType: FILTER_PAIR,
    queryLimit: 50,
    pageSize: 25,
  },
  [MENU_POSITIONS_AUDIT]: {
    icon: Icons.LIST_NUMBER,
    path: '/positions_audit',
    filterType: FILTER_ID,
    queryLimit: 250,
    pageSize: 125,
  },
  [MENU_SNAPSHOTS]: {
    icon: Icons.COLLAPSE_WIDE,
    path: ['/snapshots_positions', '/snapshots_tickers', '/snapshots_wallets'],
  },
  [MENU_SUB_ACCOUNTS]: {
    icon: Icons.USER_CIRCLE,
    path: '/sub_accounts',
  },
  [MENU_TAX_REPORT]: {
    icon: Icons.FEES_REPORT,
    path: '/tax_report',
  },
  [MENU_TRADED_VOLUME]: {
    icon: Icons.TRADE_VOLUME,
    path: '/traded_volume',
  },
  [MENU_WALLETS]: {
    icon: Icons.WALLET,
    path: '/wallets',
  },
}

export const PATHMAP = {}
ROUTE_WHITELIST.forEach((key) => {
  const { path } = MAPPING[key]

  if (_isArray(path)) {
    path.forEach((subpath) => {
      PATHMAP[subpath] = key
    })
  } else {
    PATHMAP[path] = key
  }
})

function error(target, action) {
  // eslint-disable-next-line no-console
  console.error(`${target}'s ${action} param is not defined`)
}

// get target from the following link syntax
// /target
// /target?params=
// /target/BTCUSD
// /target/BTCUSD?params=
export function getTarget(link, defaultValue = true) {
  const baseLink = `/${link.split('/')[1]}`
  const target = PATHMAP[baseLink]

  return defaultValue
    ? target || MENU_LEDGERS
    : target
}

// get icon from target
export function getIcon(target) {
  const { icon } = MAPPING[target]
  if (icon) {
    return icon
  }
  error(target, 'icon')
  return ''
}

// get path from target
export function getPath(target) {
  const { path } = MAPPING[target]
  if (path) {
    return path
  }
  error(target, 'path')
  return ''
}

export function getFilterType(target) {
  const { filterType } = MAPPING[target]
  if (filterType) {
    return filterType
  }
  error(target, 'filterType')
  return ''
}

export function getQueryLimit(target) {
  const { queryLimit } = MAPPING[target]
  return queryLimit || queryType.DEFAULT_QUERY_LIMIT
}

export function getPageSize(target) {
  const { pageSize } = MAPPING[target]
  if (pageSize) {
    return pageSize
  }
  error(target, 'pageSize')
  return 0
}

export const getIsExportHidden = (path) => _includes(NO_EXPORT_TARGETS, getTarget(path))

export default {
  getIcon,
  getFilterType,
  getPageSize,
  getPath,
  getQueryLimit,
  getTarget,
  isValidTimeStamp,
  getIsExportHidden,
  EXPORT_TARGETS,
  ROUTE_WHITELIST,
  TYPE_WHITELIST,
  NO_QUERY_LIMIT_TARGETS,
  NO_EXPORT_TARGETS,
}
