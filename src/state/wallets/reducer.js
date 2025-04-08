// https://docs.bitfinex.com/reference#rest-auth-wallets
import authTypes from 'state/auth/constants'
import { mapSymbol } from 'state/symbols/utils'

import types from './constants'

const initialState = {
  dataReceived: false,
  exactBalance: false,
  pageLoading: false,
  entries: [],
  timestamp: undefined,
}

export function walletsReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.FETCH_WALLETS:
      return {
        ...state,
        pageLoading: true,
      }
    case types.UPDATE_WALLETS: {
      if (!payload) {
        return {
          ...state,
          dataReceived: true,
          pageLoading: false,
        }
      }
      const entries = payload.map((entry) => {
        const {
          type,
          currency,
          balance,
          balanceUsd,
        } = entry
        return {
          type,
          currency: mapSymbol(currency),
          balance,
          balanceUsd,
        }
      }).sort((a, b) => a.currency.localeCompare(b.currency))
      return {
        ...state,
        dataReceived: true,
        pageLoading: false,
        entries,
      }
    }
    case types.SET_TIMESTAMP:
      return {
        ...state,
        timestamp: payload,
      }
    case types.SET_EXACT_BALANCE:
      return {
        ...state,
        exactBalance: payload,
      }
    case types.FETCH_FAIL:
      return state
    case types.REFRESH:
      return {
        ...initialState,
        timestamp: state.timestamp,
        exactBalance: state.exactBalance,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default walletsReducer
