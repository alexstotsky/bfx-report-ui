// data format https://github.com/bitfinexcom/bfx-api-node-models/blob/master/lib/position_hist.js
// https://docs.bitfinex.com/reference#rest-auth-positions-audit
import { get } from '@bitfinex/lib-js-util-base'

import { formatPair, mapPair } from 'state/symbols/utils'
import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import queryTypes from 'state/query/constants'
import {
  baseState,
  fetch,
  fetchFail,
  setTimeRange,
} from 'state/reducers.helper'

import types from './constants'

const initialState = {
  ...baseState,
  targetIds: [],
}

const TYPE = queryTypes.MENU_POSITIONS_AUDIT

export function positionsAuditReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.FETCH_PAUDIT:
      return fetch(state)
    case types.UPDATE_PAUDIT: {
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
          basePrice,
          collateral,
          id,
          leverage,
          marginFunding,
          marginFundingType,
          meta,
          mtsCreate,
          mtsUpdate,
          status,
          symbol,
        } = entry
        return {
          id,
          pair: mapPair(formatPair(symbol)),
          amount,
          basePrice,
          collateral,
          leverage,
          marginFunding,
          marginFundingType,
          meta,
          mtsCreate,
          mtsUpdate,
          status,
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
    case types.SET_IDS:
      return {
        ...initialState,
        targetIds: payload,
      }
    case types.REFRESH:
      return {
        ...initialState,
        targetIds: state.targetIds,
      }
    case timeRangeTypes.SET_TIME_RANGE:
      return setTimeRange(TYPE, state, initialState)
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default positionsAuditReducer
