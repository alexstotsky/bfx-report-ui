import types from './constants'

export function fetchFail(payload) {
  return {
    type: types.FETCH_FAIL,
    payload,
  }
}

export function fetchTaxReportTransactions() {
  return {
    type: types.FETCH_TRANSACTIONS,
  }
}

export function updateTaxReportTransactions(payload) {
  return {
    type: types.UPDATE_TRANSACTIONS,
    payload,
  }
}

export function setTransactionsStrategy(payload) {
  return {
    type: types.SET_TRANSACTIONS_STRATEGY,
    payload,
  }
}

export function setShowDisclaimer(payload) {
  return {
    type: types.SET_SHOW_DISCLAIMER,
    payload,
  }
}

export function setGenerationProgress(payload) {
  return {
    type: types.SET_GENERATION_PROGRESS,
    payload,
  }
}

export function cancelTaxReportGeneration() {
  return {
    type: types.CANCEL_TAX_REPORT_GENERATION,
  }
}

export default {
  fetchFail,
  setShowDisclaimer,
  setGenerationProgress,
  setTransactionsStrategy,
  fetchTaxReportTransactions,
  updateTaxReportTransactions,
  cancelTaxReportGeneration,
}
