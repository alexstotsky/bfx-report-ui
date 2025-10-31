export const getSummaryByAsset = state => state.summaryByAsset

export const getData = state => getSummaryByAsset(state)?.data
export const getDataReceived = state => getSummaryByAsset(state)?.dataReceived ?? false
export const getPageLoading = state => getSummaryByAsset(state)?.pageLoading ?? false
export const getSummaryByAssetEntries = state => getData(state)?.summaryByAsset ?? []
export const getSummaryByAssetTotal = state => getData(state)?.total ?? {}

export default {
  getDataReceived,
  getData,
  getPageLoading,
  getSummaryByAssetEntries,
  getSummaryByAssetTotal,
}
