import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Card, Elevation } from '@blueprintjs/core'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import DataTable from 'ui/DataTable'
import TimeRange from 'ui/TimeRange'
import Pagination from 'ui/Pagination'
import {
  SectionHeader,
  SectionHeaderRow,
  SectionHeaderItem,
  SectionHeaderTitle,
  SectionHeaderItemLabel,
} from 'ui/SectionHeader'
import ColumnsFilter from 'ui/ColumnsFilter'
import SectionSwitch from 'ui/SectionSwitch'
import MultiPairSelector from 'ui/MultiPairSelector'
import ClearFiltersButton from 'ui/ClearFiltersButton'
import {
  addTargetPair,
  fetchPositions,
  setTargetPairs,
  removeTargetPair,
  clearTargetPairs,
} from 'state/positions/actions'
import {
  getEntries,
  getPageLoading,
  getTargetPairs,
  getDataReceived,
  getExistingPairs,
} from 'state/positions/selectors'
import { getPath } from 'state/query/utils'
import queryConstants from 'state/query/constants'
import { getColumns } from 'state/filters/selectors'
import { getIsSyncRequired } from 'state/sync/selectors'
import { getColumnsWidth } from 'state/columns/selectors'
import { getFilteredEntries } from 'state/pagination/selectors'
import { getFullTime, getTimeOffset } from 'state/base/selectors'
import usePairFilter from 'hooks/usePairFilter'
import useFetchLifecycle from 'hooks/useFetchLifecycle'

import getTableColumns from './Positions.columns'

const TYPE = queryConstants.MENU_POSITIONS

const Positions = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const timeOffset = useSelector(getTimeOffset)
  const getFullTimeFn = useSelector(getFullTime)
  const pageLoading = useSelector(getPageLoading)
  const match = useRouteMatch('/positions/:pair')
  const dataReceived = useSelector(getDataReceived)
  const existingPairs = useSelector(getExistingPairs)
  const isSyncRequired = useSelector(getIsSyncRequired)
  const columns = useSelector(state => getColumns(state, TYPE))
  const columnsWidth = useSelector(state => getColumnsWidth(state, TYPE))
  const entries = useSelector(state => getFilteredEntries(state, TYPE, getEntries(state)))

  useFetchLifecycle(TYPE, {
    match,
    pageLoading,
    dataReceived,
    isSyncRequired,
    fetchData: () => dispatch(fetchPositions()),
    setTargetPairs: (p) => dispatch(setTargetPairs(p)),
  })

  const { targetPairs, togglePair, clearPairs } = usePairFilter(TYPE, {
    getTargetPairs,
    addTargetPair,
    removeTargetPair,
    clearTargetPairs,
  })

  const jumpToPositionsAudit = useCallback((e) => {
    e.preventDefault()
    const id = e.target.getAttribute('value')
    history.push(`${getPath(queryConstants.MENU_POSITIONS_AUDIT)}/${id}${window.location.search}`)
  }, [history])

  const isNoData = isEmpty(entries)
  const isLoading = !dataReceived && pageLoading
  const tableColumns = getTableColumns({
    t,
    isNoData,
    isLoading,
    timeOffset,
    columnsWidth,
    target: TYPE,
    filteredData: entries,
    getFullTime: getFullTimeFn,
    onIdClick: jumpToPositionsAudit,
  }).filter(({ id }) => columns[id])

  let showContent
  if (isNoData) {
    showContent = (
      <div className='data-table-wrapper'>
        <DataTable
          section={TYPE}
          isNoData={isNoData}
          isLoading={isLoading}
          tableColumns={tableColumns}
          numRows={isLoading ? 5 : 1}
        />
      </div>
    )
  } else {
    showContent = (
      <div className='data-table-wrapper'>
        <DataTable
          section={TYPE}
          tableColumns={tableColumns}
          numRows={isLoading ? 5 : entries.length}
        />
        <Pagination
          target={TYPE}
          loading={pageLoading}
        />
      </div>
    )
  }

  return (
    <Card
      elevation={Elevation.ZERO}
      className='col-lg-12 col-md-12 col-sm-12 col-xs-12'
    >
      <SectionHeader>
        <SectionHeaderTitle>
          {t('positions.title')}
        </SectionHeaderTitle>
        <SectionSwitch target={TYPE} />
        <SectionHeaderRow>
          <SectionHeaderItem>
            <SectionHeaderItemLabel>
              {t('selector.filter.date')}
            </SectionHeaderItemLabel>
            <TimeRange className='section-header-time-range' />
          </SectionHeaderItem>
          <SectionHeaderItem>
            <SectionHeaderItemLabel>
              {t('selector.filter.symbol')}
            </SectionHeaderItemLabel>
            <MultiPairSelector
              togglePair={togglePair}
              currentFilters={targetPairs}
              existingPairs={existingPairs}
            />
          </SectionHeaderItem>
          <ClearFiltersButton onClick={clearPairs} />
          <SectionHeaderItem>
            <SectionHeaderItemLabel>
              {t('selector.filter.columns')}
            </SectionHeaderItemLabel>
            <ColumnsFilter target={TYPE} />
          </SectionHeaderItem>
        </SectionHeaderRow>
      </SectionHeader>
      {showContent}
    </Card>
  )
}

export default Positions
