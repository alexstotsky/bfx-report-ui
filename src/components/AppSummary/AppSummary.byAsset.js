import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import DataTable from 'ui/DataTable'
import { formatDate } from 'state/utils'
import { fetchData, refresh } from 'state/summaryByAsset/actions'
import {
  getPageLoading,
  getDataReceived,
  getUseMinBalance,
  getMinimumBalance,
  getSummaryByAssetTotal,
  getSummaryByAssetEntries,
} from 'state/summaryByAsset/selectors'
import { getTimezone } from 'state/base/selectors'
import queryConstants from 'state/query/constants'
import { getColumnsWidth } from 'state/columns/selectors'
import { getTimeRange, getTimeFrame } from 'state/timeRange/selectors'
import {
  getIsSyncRequired,
  getIsFirstSyncing,
  getShouldRefreshAfterSync,
} from 'state/sync/selectors'
import { setShouldRefreshAfterSync } from 'state/sync/actions'

import SummaryFilters from './AppSummary.filters'
import { getAssetColumns } from './AppSummary.columns'
import { prepareSummaryByAssetData } from './AppSummary.helpers'

const TYPE = queryConstants.SUMMARY_BY_ASSET

const AppSummaryByAsset = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const timezone = useSelector(getTimezone)
  const timeRange = useSelector(getTimeRange)
  const pageLoading = useSelector(getPageLoading)
  const dataReceived = useSelector(getDataReceived)
  const total = useSelector(getSummaryByAssetTotal)
  const isFirstSync = useSelector(getIsFirstSyncing)
  const entries = useSelector(getSummaryByAssetEntries)
  const isSyncRequired = useSelector(getIsSyncRequired)
  const { start, end } = useSelector(getTimeFrame)
  const minimumBalance = useSelector(getMinimumBalance)
  const useMinimumBalance = useSelector(getUseMinBalance)
  const shouldRefreshAfterSync = useSelector(getShouldRefreshAfterSync)
  const columnsWidth = useSelector((state) => getColumnsWidth(state, TYPE))
  const isLoading = isFirstSync || (!dataReceived && pageLoading)
  const isNoData = dataReceived && isEmpty(entries)
  const tableClasses = classNames('summary-by-asset-table', {
    'empty-table': isNoData,
  })

  useEffect(() => {
    if (!dataReceived && !pageLoading && !isSyncRequired) {
      dispatch(fetchData())
    }
    if (shouldRefreshAfterSync) {
      dispatch(fetchData())
      dispatch(setShouldRefreshAfterSync(false))
    }
  }, [dataReceived, pageLoading, isSyncRequired, shouldRefreshAfterSync])

  useEffect(() => {
    dispatch(refresh())
  }, [timeRange])

  const preparedData = useMemo(
    () => prepareSummaryByAssetData(entries, total, t, minimumBalance, useMinimumBalance),
    [entries, total, t, minimumBalance, useMinimumBalance],
  )

  const columns = useMemo(
    () => getAssetColumns({
      preparedData, t, isLoading, isNoData, columnsWidth,
    }),
    [preparedData, t, isLoading, isNoData, columnsWidth],
  )

  return (
    <div className='app-summary-item full-width-item'>
      <div className='app-summary-item-title--row'>
        <div>
          <div className='app-summary-item-title'>
            {t('summary.by_asset.title')}
          </div>
          <div className='app-summary-item-sub-title'>
            {t('summary.by_asset.sub_title')}
            {`${formatDate(start, timezone)} - ${formatDate(end, timezone)}`}
          </div>
        </div>
        <SummaryFilters />
      </div>
      <DataTable
        section={TYPE}
        defaultRowHeight={73}
        tableColumns={columns}
        className={tableClasses}
        numRows={isLoading ? 3 : preparedData.length}
      />
    </div>
  )
}

export default AppSummaryByAsset
