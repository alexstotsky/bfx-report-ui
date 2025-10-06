const getSync = state => state.sync || {}
const getSyncConf = state => getSync(state).config || {}

export const getSyncMode = state => getSync(state).syncMode || false
export const getSyncProgress = state => getSync(state).progress || 0
export const getIsSyncing = state => getSync(state).isSyncing || false
export const getEstimatedSyncTime = state => getSync(state)?.estimatedSyncTime ?? {}

export const getPublicTradesPref = state => getSyncConf(state).publicTradesConf || {}
export const getPublicTradesStartTime = state => getPublicTradesPref(state).startTime
export const getPublicTradesPairs = state => getPublicTradesPref(state).pairs || []

export const getPublicFundingPref = state => getSyncConf(state).publicFundingConf || {}
export const getPublicFundingStartTime = state => getPublicFundingPref(state).startTime
export const getPublicFundingSymbols = state => getPublicFundingPref(state).symbols || []

export const getTickersHistoryConf = state => getSyncConf(state).tickersHistoryConf || {}
export const getTickersHistoryStartTime = state => getTickersHistoryConf(state).startTime
export const getTickersHistoryPairs = state => getTickersHistoryConf(state).pairs || []

export const getCandlesConf = state => getSyncConf(state).candlesConf || []
export const getStatusMessagesConf = state => getSyncConf(state).statusMessagesConf || []
export const getIsSyncRequired = state => getSync(state)?.isSyncRequired ?? false
export const getIsInitSyncPopupOpen = state => getSync(state)?.showInitSyncPopup ?? false
export const getIsLongSync = state => getSync(state)?.isLongSync ?? false
export const getIsFirstSyncing = state => (getIsSyncRequired(state) && getIsSyncing(state)) ?? false
export const getLastSyncTime = state => getSync(state)?.lastSyncMts ?? null
export const getShouldRefreshAfterSync = state => getSync(state)?.shouldRefreshAfterSync ?? false

export default {
  getSyncMode,
  getSyncProgress,
  getIsSyncing,
  getEstimatedSyncTime,
  getPublicTradesPref,
  getPublicTradesStartTime,
  getPublicTradesPairs,
  getPublicFundingPref,
  getPublicFundingStartTime,
  getPublicFundingSymbols,
  getTickersHistoryConf,
  getTickersHistoryStartTime,
  getTickersHistoryPairs,
  getCandlesConf,
  getStatusMessagesConf,
  getIsSyncRequired,
  getIsInitSyncPopupOpen,
  getIsLongSync,
  getIsFirstSyncing,
  getLastSyncTime,
  getShouldRefreshAfterSync,
}
