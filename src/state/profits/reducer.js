import authTypes from 'state/auth/constants'
import timeRangeTypes from 'state/timeRange/constants'
import timeframeConstants from 'ui/TimeFrameSelector/constants'
import reportTypeConstants from 'ui/ReportTypeSelector/constants'
import unrealizedProfitConstants from 'ui/UnrealizedProfitSelector/constants'

import { fetchFail } from 'state/reducers.helper'

import types from './constants'

export const initialState = {
  entries: [],
  pageLoading: false,
  dataReceived: false,
  currentFetchParams: {},
  timeframe: timeframeConstants.DAY,
  reportType: reportTypeConstants.WIN_LOSS,
  isVSPrevDayBalance: false,
  isVsAccountBalanceSelected: false,
  isUnrealizedProfitExcluded: unrealizedProfitConstants.FALSE,
}

export function profitsReducer(state = initialState, action) {
  const { type: actionType, payload } = action
  switch (actionType) {
    case types.FETCH_PROFITS:
      return {
        ...initialState,
        pageLoading: true,
        currentFetchParams: {
          timeframe: state.timeframe,
          isVSPrevDayBalance: state.isVSPrevDayBalance,
          isUnrealizedProfitExcluded: state.isUnrealizedProfitExcluded,
          isVsAccountBalanceSelected: state.isVsAccountBalanceSelected,
        },
        timeframe: state.timeframe,
        reportType: state.reportType,
        isVSPrevDayBalance: state.isVSPrevDayBalance,
        isUnrealizedProfitExcluded: state.isUnrealizedProfitExcluded,
        isVsAccountBalanceSelected: state.isVsAccountBalanceSelected,
      }
    case types.UPDATE_PROFITS: {
      if (!payload) {
        return {
          ...state,
          dataReceived: true,
          pageLoading: false,
        }
      }
      return {
        ...state,
        dataReceived: true,
        pageLoading: false,
        entries: payload,
      }
    }
    case types.SET_PARAMS:
      return {
        ...state,
        ...payload,
      }
    case types.SET_REPORT_TYPE:
      return {
        ...state,
        reportType: payload,
      }
    case types.FETCH_FAIL:
      return fetchFail(state)
    case types.REFRESH:
    case timeRangeTypes.SET_TIME_RANGE:
      return {
        ...initialState,
        timeframe: state.timeframe,
        reportType: state.reportType,
        isVSPrevDayBalance: state.isVSPrevDayBalance,
        isUnrealizedProfitExcluded: state.isUnrealizedProfitExcluded,
        isVsAccountBalanceSelected: state.isVsAccountBalanceSelected,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default profitsReducer
