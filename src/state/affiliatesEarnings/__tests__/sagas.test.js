import { put, call, select } from 'redux-saga/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils'

import queryTypes from 'state/query/constants'
import { getTimeFrame } from 'state/timeRange/selectors'
import { updatePagination } from 'state/pagination/actions'
import { fetchDataWithPagination } from 'state/sagas.helper'
import { getPaginationData } from 'state/pagination/selectors'
import { getLedgersFilterQuery } from 'state/filters/selectors'

import actions from '../actions'
import { getAffiliatesEarnings } from '../selectors'
import { getReqLedgers, fetchAffiliatesEarnings } from '../saga'

const FILTER = {}
const WALLET = 'exchange'
const TARGET_SYMBOLS = ['USD']
const ERROR = { message: 'fail' }
const PAGINATION_DATA = { smallestMts: 0 }
const TIME_FRAME = { start: 1000, end: 2000 }
const RESULT = { res: [], nextPage: false }
const FILTER_QUERY = { filter: FILTER, wallet: WALLET }
const TYPE = queryTypes.MENU_AFFILIATES_EARNINGS

describe('AffiliatesEarnings saga', () => {
  const generator = cloneableGenerator(fetchAffiliatesEarnings)()

  it('selects the affiliates earnings', () => {
    const result = generator.next().value
    expect(result).toEqual(select(getAffiliatesEarnings))
  })

  it('selects the pagination data', () => {
    const result = generator.next({ targetSymbols: TARGET_SYMBOLS }).value
    expect(result).toEqual(select(getPaginationData, TYPE))
  })

  it('selects the time frame', () => {
    const result = generator.next(PAGINATION_DATA).value
    expect(result).toEqual(select(getTimeFrame, PAGINATION_DATA.smallestMts))
  })

  it('selects the filter query', () => {
    const result = generator.next(TIME_FRAME).value
    expect(result).toEqual(select(getLedgersFilterQuery, TYPE))
  })

  it('calls the API', () => {
    const result = generator.next(FILTER_QUERY).value
    expect(result).toEqual(call(fetchDataWithPagination, getReqLedgers, {
      end: TIME_FRAME.end,
      start: TIME_FRAME.start,
      filter: FILTER,
      wallet: WALLET,
      targetSymbols: TARGET_SYMBOLS,
    }))
  })

  describe('request returns error', () => {
    let clone

    beforeAll(() => {
      clone = generator.clone()
      clone.next({ result: RESULT, error: ERROR }) // updates data
      clone.next() // updates pagination
    })

    it('raises failed action', () => {
      const result = clone.next().value
      expect(result).toEqual(put(actions.fetchFail({
        id: 'status.fail',
        topic: 'affiliatesearnings.title',
        detail: ERROR.message,
      })))
    })
  })

  describe('request throws error', () => {
    let clone

    beforeAll(() => {
      clone = generator.clone()
    })

    it('raises failed action', () => {
      const result = clone.throw({}).value
      expect(result).toEqual(put(actions.fetchFail({
        id: 'status.request.error',
        topic: 'affiliatesearnings.title',
        detail: JSON.stringify({}),
      })))
    })

    it('performs no further work', () => {
      const result = clone.next().done
      expect(result).toBe(true)
    })
  })

  it('updates data', () => {
    const result = generator.next({ result: RESULT, error: false }).value
    expect(result).toEqual(put(actions.updateAffiliatesEarnings(RESULT)))
  })

  it('updates pagination', () => {
    const result = generator.next().value
    expect(result).toEqual(put(updatePagination(TYPE, RESULT)))
  })

  it('performs no further work', () => {
    const result = generator.next().done
    expect(result).toBe(true)
  })
})
