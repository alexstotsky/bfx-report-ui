import { call, put, takeLatest } from 'redux-saga/effects'
import { isEqual } from '@bitfinex/lib-js-util-base'

import { initSync } from 'state/sync/saga'
import { makeFetchCall } from 'state/utils'
import { authExpired } from 'state/auth/actions'
import {
  setIsSyncing,
  updateSyncStatus,
  showInitSyncPopup,
  setIsSyncRequired,
} from 'state/sync/actions'

import {
  toggleExportDialog,
  showMaintenanceModal,
  toggleExportFailDialog,
  toggleExportSuccessDialog,
} from 'state/ui/actions'
import syncTypes from 'state/sync/constants'
import { setIsReportExporting } from 'state/query/actions'
import { updateStatus, updateWarningStatus } from 'state/status/actions'

import types from './constants'
import login from './signIn'

const fetchSyncProgress = () => makeFetchCall('getSyncProgress')

function* checkSyncState() {
  const { result: { state } } = yield call(fetchSyncProgress)
  if (!isEqual(state, syncTypes.SYNC_STARTED)) {
    yield put(setIsSyncing(false))
    yield put(setIsSyncRequired(false))
    yield put(showInitSyncPopup(false))
  }
}

function* reconnect() {
  const wsAuth = yield call(login)
  if (wsAuth) {
    yield call(initSync)
    yield put(updateSyncStatus())
  }
}

function* notifyNetError() {
  yield put(updateWarningStatus({ id: 'status.netError' }))
}

function* notifyNetResumed() {
  yield put(updateStatus({ id: 'status.netResumed' }))
  yield call(checkSyncState)
}

function* handleTokenAuthRequired() {
  yield put(authExpired())
}

function* handleReportGenerationCompleted() {
  yield put(setIsReportExporting(false))
  yield put(toggleExportDialog())
  yield put(toggleExportSuccessDialog())
}

function* handleReportGenerationFailed() {
  yield put(setIsReportExporting(false))
  yield put(toggleExportDialog())
  yield put(toggleExportFailDialog())
}

function* handleMaintenanceTurnedOn() {
  yield put(showMaintenanceModal(true))
}

function* handleMaintenanceTurnedOff() {
  yield put(showMaintenanceModal(false))
}

export default function* wsSaga() {
  yield takeLatest(types.WS_RECONNECT, reconnect)
  yield takeLatest(types.WS_NET_ERROR, notifyNetError)
  yield takeLatest(types.WS_NET_RESUMED, notifyNetResumed)
  yield takeLatest(types.WS_BFX_TOKEN_AUTH_REQUIRED, handleTokenAuthRequired)
  yield takeLatest(types.WS_MAINTENANCE_TURNED_ON, handleMaintenanceTurnedOn)
  yield takeLatest(types.WS_MAINTENANCE_TURNED_OFF, handleMaintenanceTurnedOff)
  yield takeLatest(types.WS_REPORT_GENERATION_COMPLETED, handleReportGenerationCompleted)
  yield takeLatest(types.WS_REPORT_GENERATION_FAILED, handleReportGenerationFailed)
}
