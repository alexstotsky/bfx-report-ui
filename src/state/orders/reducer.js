// https://docs.bitfinex.com/reference#rest-auth-orders-history
import { get } from '@bitfinex/lib-js-util-base'

import { formatPair, mapPair } from 'state/symbols/utils'
import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import queryTypes from 'state/query/constants'
import {
  addPair,
  basePairState,
  clearPairs,
  fetch,
  fetchFail,
  refresh,
  removePair,
  setPairs,
  setTimeRange,
} from 'state/reducers.helper'

import types from './constants'

const initialState = {
  ...basePairState,
}

const TYPE = queryTypes.MENU_ORDERS

export function ordersReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.FETCH_ORDERS:
      return fetch(state)
    case types.UPDATE_ORDERS: {
      const res = get(payload, ['data', 'res'])
      if (!res) {
        return {
          ...state,
          dataReceived: true,
          pageLoading: false,
        }
      }
      const { existingPairs } = state
      const updatePairs = [...existingPairs]
      const entries = res.map((entry) => {
        const {
          amount,
          amountExecuted,
          amountOrig,
          cid,
          flags,
          gid,
          id,
          mtsCreate,
          mtsUpdate,
          notify,
          placedId,
          price,
          priceAvg,
          priceAuxLimit,
          priceTrailing,
          status,
          symbol,
          type,
          typePrev,
          meta,
        } = entry
        const formattedPair = mapPair(formatPair(symbol))
        // save new pair to updatePairs list
        if (updatePairs.indexOf(formattedPair) === -1) {
          updatePairs.push(formattedPair)
        }
        return {
          id,
          gid,
          cid,
          pair: formattedPair,
          mtsCreate,
          mtsUpdate,
          amount,
          amountExecuted,
          amountOrig,
          type,
          typePrev,
          flags,
          status,
          price,
          priceAvg,
          priceTrailing,
          priceAuxLimit,
          notify,
          placedId,
          meta,
        }
      })
      return {
        ...state,
        dataReceived: true,
        pageLoading: false,
        entries: [...state.entries, ...entries],
        existingPairs: updatePairs.sort(),
      }
    }
    case types.FETCH_FAIL:
      return fetchFail(state)
    case types.ADD_PAIR:
      return addPair(state, payload, initialState)
    case types.REMOVE_PAIR:
      return removePair(state, payload, initialState)
    case types.SET_PAIRS:
      return setPairs(state, payload, initialState)
    case types.REFRESH:
      return refresh(TYPE, state, initialState)
    case types.CLEAR_PAIRS:
      return clearPairs(state, initialState)
    case timeRangeTypes.SET_TIME_RANGE:
      return setTimeRange(TYPE, state, initialState)
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default ordersReducer
