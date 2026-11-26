import { setTimeRange } from 'state/timeRange/actions'
import timeRangeTypes from 'state/timeRange/constants'

import actions from '../actions'
import reducer, { initialState } from '../reducer'

const TEST_SYMBOL = 'USD'
const TEST_ENTRY = {
  id: 1,
  side: 1,
  flags: 0,
  period: 2,
  rate: 0.25,
  amount: 100,
  renew: false,
  hidden: false,
  notify: false,
  type: 'FIXED',
  noClose: false,
  rateReal: 0.25,
  mtsCreate: 1000,
  mtsUpdate: 2000,
  symbol: 'fUSD',
  status: 'ACTIVE',
  mtsOpening: 1000,
  mtsLastPayout: 2000,
  positionPair: 'tBTCUSD',
}

describe('FundingCreditHistory state', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should set loading on fetch', () => {
    expect(reducer(initialState, actions.fetchFCredit()))
      .toEqual({
        ...initialState,
        pageLoading: true,
      })
  })

  it('should update funding credit history', () => {
    expect(reducer(initialState, actions.updateFCredit({ res: [TEST_ENTRY] })))
      .toEqual({
        ...initialState,
        dataReceived: true,
        existingCoins: [TEST_SYMBOL],
        entries: [{
          ...TEST_ENTRY,
          rate: 25,
          symbol: TEST_SYMBOL,
          positionPair: 'BTC:USD',
        }],
      })
  })

  it('should keep entries on empty update', () => {
    expect(reducer(initialState, actions.updateFCredit(undefined)))
      .toEqual({
        ...initialState,
        dataReceived: true,
      })
  })

  it('should add target symbol', () => {
    expect(reducer(initialState, actions.addTargetSymbol(TEST_SYMBOL)))
      .toEqual({
        ...initialState,
        targetSymbols: [TEST_SYMBOL],
      })
  })

  it('should remove target symbol', () => {
    const state = {
      ...initialState,
      targetSymbols: [TEST_SYMBOL],
    }
    expect(reducer(state, actions.removeTargetSymbol(TEST_SYMBOL)))
      .toEqual(initialState)
  })

  it('should set target symbols', () => {
    expect(reducer(initialState, actions.setTargetSymbols([TEST_SYMBOL])))
      .toEqual({
        ...initialState,
        targetSymbols: [TEST_SYMBOL],
      })
  })

  it('should clear target symbols', () => {
    const state = {
      ...initialState,
      targetSymbols: [TEST_SYMBOL],
    }
    expect(reducer(state, actions.clearTargetSymbols()))
      .toEqual(initialState)
  })

  it('should refresh data', () => {
    const state = {
      ...initialState,
      dataReceived: true,
      targetSymbols: [TEST_SYMBOL],
    }
    expect(reducer(state, actions.refresh()))
      .toEqual({
        ...initialState,
        targetSymbols: state.targetSymbols,
      })
  })

  it('should keep target symbols on time range change', () => {
    const state = {
      ...initialState,
      dataReceived: true,
      targetSymbols: [TEST_SYMBOL],
      existingCoins: [TEST_SYMBOL],
    }
    expect(reducer(state, setTimeRange({ range: timeRangeTypes.PAST_MONTH })))
      .toEqual({
        ...initialState,
        targetSymbols: state.targetSymbols,
      })
  })
})
