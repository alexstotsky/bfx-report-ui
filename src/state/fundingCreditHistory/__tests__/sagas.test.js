import { put, call, select } from 'redux-saga/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils'

import queryTypes from 'state/query/constants'
import { getTimeFrame } from 'state/timeRange/selectors'
import { getFilterQuery } from 'state/filters/selectors'
import { updatePagination } from 'state/pagination/actions'
import { fetchDataWithPagination } from 'state/sagas.helper'
import { getPaginationData } from 'state/pagination/selectors'

import actions from '../actions'
import { fetchFCredit, getReqFCredit } from '../saga'
import { getFundingCreditHistory } from '../selectors'

const FILTER = {}
const ERROR = { message: 'fail' }
const TARGET_SYMBOLS = ['USD']
const TYPE = queryTypes.MENU_FCREDIT
const PAGINATION_DATA = { smallestMts: 0 }
const TIME_FRAME = { start: 1000, end: 2000 }
const RESULT = { res: [], nextPage: false }

describe('FundingCreditHistory saga', () => {
  const generator = cloneableGenerator(fetchFCredit)()

  it('selects the funding credit history', () => {
    const result = generator.next().value
    expect(result).toEqual(select(getFundingCreditHistory))
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
    expect(result).toEqual(select(getFilterQuery, TYPE))
  })

  it('calls the API', () => {
    const result = generator.next(FILTER).value
    expect(result).toEqual(call(fetchDataWithPagination, getReqFCredit, {
      start: TIME_FRAME.start,
      end: TIME_FRAME.end,
      targetSymbols: TARGET_SYMBOLS,
      filter: FILTER,
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
        topic: 'fcredit.title',
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
        topic: 'fcredit.title',
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
    expect(result).toEqual(put(actions.updateFCredit(RESULT)))
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
