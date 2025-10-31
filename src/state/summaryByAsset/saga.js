import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects'

import { makeFetchCall } from 'state/utils'
import { updateErrorStatus } from 'state/status/actions'

import types from './constants'
import actions from './actions'

export const getReqSummaryByAsset = () => makeFetchCall('getSummaryByAsset')

export function* fetchSummaryByAsset() {
  try {
    const { result = {}, error } = yield call(getReqSummaryByAsset)
    yield put(actions.updateData(result))

    if (error) {
      yield put(actions.fetchFail({
        id: 'status.fail',
        topic: 'accountsummary.title',
        detail: error?.message ?? JSON.stringify(error),
      }))
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'accountsummary.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* refreshSummaryByAsset() {
  yield put(actions.fetchData())
}

function* fetchSummaryByAssetFail({ payload }) {
  yield put(updateErrorStatus(payload))
}

export default function* accountSummarySaga() {
  yield takeLatest(types.FETCH, fetchSummaryByAsset)
  yield takeLatest(types.REFRESH, refreshSummaryByAsset)
  yield takeLatest(types.FETCH_FAIL, fetchSummaryByAssetFail)
}
