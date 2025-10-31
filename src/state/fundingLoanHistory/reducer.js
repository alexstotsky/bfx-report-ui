// https://docs.bitfinex.com/v2/reference#rest-auth-funding-loans-hist
import { get } from '@bitfinex/lib-js-util-base'

import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import queryTypes from 'state/query/constants'
import {
  addSymbol,
  baseSymbolState,
  clearSymbols,
  fetch,
  fetchFail,
  formatPercent,
  refresh,
  removeSymbol,
  setSymbols,
  setTimeRange,
} from 'state/reducers.helper'
import { mapSymbol } from 'state/symbols/utils'

import types from './constants'

const initialState = {
  ...baseSymbolState,
}

const TYPE = queryTypes.MENU_FLOAN

export function fundingLoanHistoryReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case types.FETCH_FLOAN:
      return fetch(state)
    case types.UPDATE_FLOAN: {
      const res = get(payload, ['data', 'res'])
      if (!res) {
        return {
          ...state,
          dataReceived: true,
          pageLoading: false,
        }
      }
      const { existingCoins } = state
      const updateCoins = [...existingCoins]
      const entries = res.map((entry) => {
        const {
          amount,
          flags,
          hidden,
          id,
          mtsCreate,
          mtsLastPayout,
          mtsOpening,
          mtsUpdate,
          noClose,
          notify,
          period,
          rate,
          rateReal,
          renew,
          side,
          status,
          type, // eslint-disable-line no-shadow
          symbol,
        } = entry
        const currentSymbol = mapSymbol(symbol.slice(1))
        // save new symbol to updateCoins list
        if (updateCoins.indexOf(currentSymbol) === -1) {
          updateCoins.push(currentSymbol)
        }
        return {
          id,
          symbol: currentSymbol,
          side,
          mtsCreate,
          mtsUpdate,
          amount,
          flags,
          status,
          type,
          rate: formatPercent(rate),
          period,
          mtsOpening,
          mtsLastPayout,
          notify,
          hidden,
          renew,
          rateReal,
          noClose,
        }
      })
      return {
        ...state,
        dataReceived: true,
        pageLoading: false,
        entries: [...state.entries, ...entries],
        existingCoins: updateCoins.sort(),
      }
    }
    case types.FETCH_FAIL:
      return fetchFail(state)
    case types.ADD_SYMBOL:
      return addSymbol(state, payload, initialState)
    case types.REMOVE_SYMBOL:
      return removeSymbol(state, payload, initialState)
    case types.SET_SYMBOLS:
      return setSymbols(state, payload, initialState)
    case types.REFRESH:
      return refresh(TYPE, state, initialState)
    case types.CLEAR_SYMBOLS:
      return clearSymbols(state, initialState)
    case timeRangeTypes.SET_TIME_RANGE:
      return setTimeRange(TYPE, state, initialState)
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default fundingLoanHistoryReducer
