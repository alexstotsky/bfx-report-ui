import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects'

import { makeFetchCall } from 'state/utils'
import { getTimeFrame } from 'state/timeRange/selectors'
import { getQueryLimit } from 'state/query/utils'
import { updateErrorStatus } from 'state/status/actions'
import queryTypes from 'state/query/constants'
import { mapRequestSymbols } from 'state/symbols/utils'
import { getFilterQuery } from 'state/filters/selectors'
import { refreshPagination, updatePagination } from 'state/pagination/actions'
import { getPaginationData } from 'state/pagination/selectors'
import { fetchDataWithPagination } from 'state/sagas.helper'

import types from './constants'
import actions from './actions'
import { getInvoices } from './selectors'

const TYPE = queryTypes.MENU_INVOICES

function getReqInvoices({
  start,
  end,
  targetSymbols,
  filter,
}) {
  const params = {
    start,
    end,
    filter,
    limit: getQueryLimit(TYPE),
    symbol: targetSymbols.length ? mapRequestSymbols(targetSymbols) : undefined,
  }

  return makeFetchCall('getPayInvoiceList', params)
}

/* eslint-disable-next-line consistent-return */
function* fetchInvoices() {
  try {
    const { targetSymbols } = yield select(getInvoices)
    const { smallestMts } = yield select(getPaginationData, TYPE)
    const filter = yield select(getFilterQuery, TYPE)

    const { start, end } = yield select(getTimeFrame, smallestMts)
    const { result, error } = yield call(fetchDataWithPagination, getReqInvoices, {
      start,
      end,
      targetSymbols,
      filter,
    })

    yield put(actions.updateInvoices(result))
    yield put(updatePagination(TYPE, result))

    if (error) {
      const { code, message } = error
      if (code === 409) {
        yield put(actions.fetchFail({
          id: 'status.fail',
          topic: 'invoices.title',
          detail: message,
        }))
      } else {
        yield put(actions.fetchFail({
          id: 'status.fail',
          topic: 'invoices.title',
          detail: error?.message ?? JSON.stringify(error),
        }))
      }
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'invoices.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* refreshInvoices() {
  yield put(refreshPagination(TYPE))
}

function* fetchInvoicesFail({ payload }) {
  yield put(updateErrorStatus(payload))
}

export default function* invoicesSaga() {
  yield takeLatest(types.FETCH_INVOICES, fetchInvoices)
  yield takeLatest([types.REFRESH, types.ADD_SYMBOL, types.REMOVE_SYMBOL, types.CLEAR_SYMBOLS], refreshInvoices)
  yield takeLatest(types.FETCH_FAIL, fetchInvoicesFail)
}
