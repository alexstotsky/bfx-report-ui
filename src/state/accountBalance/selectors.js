export const getBalance = state => state.balance

export const getCurrentFetchParams = state => getBalance(state).currentFetchParams
export const getDataReceived = state => getBalance(state).dataReceived
export const getEntries = state => getBalance(state).entries
export const getPageLoading = state => getBalance(state).pageLoading
export const getTimeframe = state => getBalance(state).timeframe
export const getIsUnrealizedProfitExcluded = state => getBalance(state).isUnrealizedProfitExcluded
export const getCurrentTimeFrame = state => getCurrentFetchParams(state)?.timeframe
export const getDefaultDataReceived = state => getBalance(state).defaultDataReceived ?? false

export default {
  getBalance,
  getCurrentFetchParams,
  getDataReceived,
  getEntries,
  getPageLoading,
  getTimeframe,
  getIsUnrealizedProfitExcluded,
  getCurrentTimeFrame,
  getDefaultDataReceived,
}
