import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import {
  baseSymbolState,
  fetch,
  fetchFail,
} from 'state/reducers.helper'

import types from './constants'
import { updateInvoices } from './utils'

const initialState = {
  ...baseSymbolState,
}

export function invoicesReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case types.FETCH_INVOICES:
      return fetch(state)
    case types.UPDATE_INVOICES:
      return updateInvoices(state, payload)
    case types.FETCH_FAIL:
      return fetchFail(state)
    case types.ADD_SYMBOL:
      return state.targetSymbols.includes(payload)
        ? state
        : {
          ...initialState,
          targetCategory: state.targetCategory,
          targetSymbols: [...state.targetSymbols, payload],
          existingCoins: state.existingCoins,
        }
    case types.REMOVE_SYMBOL:
      return (state.targetSymbols.includes(payload))
        ? {
          ...initialState,
          targetCategory: state.targetCategory,
          targetSymbols: state.targetSymbols.filter(symbol => symbol !== payload),
          existingCoins: state.existingCoins,
        }
        : state
    case types.SET_SYMBOLS:
      return {
        ...initialState,
        targetSymbols: payload,
        existingCoins: state.existingCoins,
        targetCategory: state.targetCategory,
      }
    case types.REFRESH:
      return {
        ...initialState,
        targetCategory: state.targetCategory,
        targetSymbols: state.targetSymbols,
        existingPairs: state.existingPairs,
      }
    case types.CLEAR_SYMBOLS:
      return {
        ...initialState,
        existingCoins: state.existingCoins,
        targetCategory: state.targetCategory,
      }
    case timeRangeTypes.SET_TIME_RANGE:
      return {
        ...initialState,
        targetCategory: state.targetCategory,
        targetSymbols: state.targetSymbols,
        existingCoins: state.existingCoins,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default invoicesReducer
