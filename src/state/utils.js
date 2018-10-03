import _padStart from 'lodash/padStart'
import moment from 'moment'

import { platform } from 'var/config'

export function postJsonfetch(url, bodyJson) {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyJson),
  })
    .then(response => response.json())
    .catch(error => error)
    .then(data => data)
}

export function makeFetchCall(method, auth = null, params = null) {
  return postJsonfetch(`${platform.API_URL}/get-data`, {
    auth,
    method,
    params,
  })
}

export function formatTime(mts) {
  const date = new Date(mts)
  // 18-07-06 02:08:02
  return `${date.getFullYear() % 100}-${_padStart(date.getMonth() + 1, 2, 0)}-${_padStart(date.getDate(), 2, 0)}
 ${_padStart(date.getHours(), 2, 0)}:${_padStart(date.getMinutes(), 2, 0)}:${_padStart(date.getSeconds(), 2, 0)}`
}

const MONTH_SYM = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function formatDate(mts) {
  const date = new Date(mts)
  // MMM dd yyyy
  return `${MONTH_SYM[date.getMonth()]} ${_padStart(date.getDate(), 2, 0)} ${date.getFullYear()}`
}

// tBTCUSD -> btcusd
export function formatInternalPair(symbol) {
  return `${symbol.slice(1).toLowerCase()}`
}

// tBTCUSD -> BTC/USD
export function formatSymbolToPair(symbol) {
  return `${symbol.slice(1, 4)}/${symbol.slice(4, 7)}`
}

// btcusd -> BTC/USD
export function formatPair(pair) {
  if (!pair || pair === 'ALL') {
    return 'ALL'
  }
  return `${pair.slice(0, 3).toUpperCase()}/${pair.slice(3, 6).toUpperCase()}`
}

// btcusd -> tBTCUSD
export function formatRawPairToTPair(pair) {
  return `t${pair.toUpperCase()}`
}

// USD -> fUSD
export function formatRawSymbolToFSymbol(symbol) {
  return `f${symbol.toUpperCase()}`
}

const TYPE_WHITELIST = [
  'fcredit',
  'floan',
  'foffer',
  'ledgers',
  'movements',
  'orders',
  'trades',
]

export function isValidateType(type) {
  return TYPE_WHITELIST.includes(type)
}

export function checkFetch(prevProps, props, type) {
  if (!isValidateType(type)) {
    return
  }
  const { loading: prevLoading } = prevProps
  const { loading } = props
  // eslint-disable-next-line react/destructuring-assignment
  const fetch = props[`fetch${type.charAt(0).toUpperCase() + type.slice(1)}`]
  if (loading && loading !== prevLoading) {
    fetch()
  }
}

export function getCurrentEntries(entries, offset, limit, pageOffset, pageSize) {
  return offset < limit
    ? entries.slice(pageOffset, pageOffset + pageSize)
    : entries.slice(offset + pageOffset - limit, offset + pageOffset - limit + pageSize)
}

export function momentFormatter(format) {
  return {
    formatDate: date => moment(date).format(format),
    parseDate: str => moment(str, format).toDate(),
    placeholder: `${format} (moment)`,
  }
}

export function getSideMsg(side) {
  let msg
  if (side === 1) {
    msg = 'provided'
  } else if (side === 0) {
    msg = 'both'
  } else if (side === -1) {
    msg = 'taken'
  } else {
    msg = 'null'
  }
  return msg
}

export default {
  checkFetch,
  makeFetchCall,
  formatDate,
  formatInternalPair,
  formatPair,
  formatRawPairToTPair,
  formatRawSymbolToFSymbol,
  formatSymbolToPair,
  formatTime,
  getCurrentEntries,
  getSideMsg,
  isValidateType,
  momentFormatter,
  postJsonfetch,
}
