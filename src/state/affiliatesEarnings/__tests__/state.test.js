import { setTimeRange } from 'state/timeRange/actions'
import timeRangeTypes from 'state/timeRange/constants'

import actions from '../actions'
import reducer, { initialState } from '../reducer'

const TEST_SYMBOL = 'USD'
const TEST_ENTRY = {
  id: 1,
  mts: 1000,
  amount: 10,
  balance: 200,
  amountUsd: 10,
  balanceUsd: 200,
  currency: 'USD',
  wallet: 'exchange',
  description: 'Affiliate Rebate',
}

describe('AffiliatesEarnings state', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should set loading on fetch', () => {
    expect(reducer(initialState, actions.fetchAffiliatesEarnings()))
      .toEqual({
        ...initialState,
        pageLoading: true,
      })
  })

  it('should update affiliates earnings', () => {
    expect(reducer(initialState, actions.updateAffiliatesEarnings({ res: [TEST_ENTRY] })))
      .toEqual({
        ...initialState,
        dataReceived: true,
        entries: [TEST_ENTRY],
        existingCoins: [TEST_SYMBOL],
      })
  })

  it('should keep entries on empty update', () => {
    expect(reducer(initialState, actions.updateAffiliatesEarnings(undefined)))
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
