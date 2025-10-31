// https://docs.bitfinex.com/v2/reference#rest-public-trades
import { get } from '@bitfinex/lib-js-util-base'

import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import {
  baseState,
  fetch,
  fetchFail,
} from 'state/reducers.helper'
import { mapPair } from 'state/symbols/utils'

import types from './constants'

const initialState = {
  ...baseState,
  targetPair: mapPair('BTC:USD'),
}

export function publicTradesReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.FETCH_PUBLIC_TRADES:
      return fetch(state)
    case types.UPDATE_PUBLIC_TRADES: {
      const res = get(payload, ['data', 'res'])
      if (!res) {
        return {
          ...state,
          dataReceived: true,
          pageLoading: false,
        }
      }
      const entries = res.map((entry) => {
        const {
          amount,
          price,
          id,
          mts,
        } = entry
        return {
          id,
          mts,
          amount,
          price,
          type: parseFloat(amount) > 0 ? 'BUY' : 'SELL',
        }
      })
      return {
        ...state,
        dataReceived: true,
        pageLoading: false,
        entries: [...state.entries, ...entries],
      }
    }
    case types.FETCH_FAIL:
      return fetchFail(state)
    case types.SET_PAIR:
      return {
        ...initialState,
        targetPair: payload,
      }
    case types.REFRESH:
    case timeRangeTypes.SET_TIME_RANGE:
      return {
        ...initialState,
        targetPair: state.targetPair,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default publicTradesReducer
