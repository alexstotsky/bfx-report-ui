import types from './constants'

export function fetchProfits(payload) {
  return {
    type: types.FETCH_PROFITS,
    payload,
  }
}

export function fetchFail(payload) {
  return {
    type: types.FETCH_FAIL,
    payload,
  }
}

export function refresh() {
  return {
    type: types.REFRESH,
  }
}

export function updateProfits(payload) {
  return {
    type: types.UPDATE_PROFITS,
    payload,
  }
}

export default {
  fetchFail,
  fetchProfits,
  refresh,
  updateProfits,
}
