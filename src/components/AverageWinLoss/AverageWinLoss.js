import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Elevation } from '@blueprintjs/core'
import _sortBy from 'lodash/sortBy'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import {
  SectionHeader,
  SectionHeaderRow,
  SectionHeaderItem,
  SectionHeaderTitle,
  SectionHeaderItemLabel,
} from 'ui/SectionHeader'
import NoData from 'ui/NoData'
import Loading from 'ui/Loading'
import Chart from 'ui/Charts/Chart'
import TimeRange from 'ui/TimeRange'
import InitSyncNote from 'ui/InitSyncNote'
import RefreshButton from 'ui/RefreshButton'
import SectionSwitch from 'ui/SectionSwitch'
import TimeFrameSelector from 'ui/TimeFrameSelector'
import {
  parseChartData,
  parseVSAccBalanceChartData,
} from 'ui/Charts/Charts.helpers'
import ReportTypeSelector from 'ui/ReportTypeSelector'
import UnrealizedProfitSelector from 'ui/UnrealizedProfitSelector'
import queryConstants from 'state/query/constants'
import { checkFetch, checkInit } from 'state/utils'
import constants from 'ui/ReportTypeSelector/constants'

const TYPE = queryConstants.MENU_WIN_LOSS

const prepareChartData = (
  entries, timeframe, isVSAccBalanceData, t,
) => {
  if (isVSAccBalanceData) {
    const { chartData, dataKeys } = parseVSAccBalanceChartData({
      data: _sortBy(entries, ['mts']),
      timeframe,
      t,
    })
    return { chartData, dataKeys }
  }

  const { chartData, presentCurrencies } = parseChartData({
    data: _sortBy(entries, ['mts']),
    timeframe,
  })
  return { chartData, dataKeys: presentCurrencies }
}

const getReportTypeParams = (type) => {
  switch (type) {
    case constants.WIN_LOSS:
      return { isVsAccountBalanceSelected: false }
    case constants.GAINS_DEPOSITS:
      return { isVsAccountBalanceSelected: true, isVSPrevDayBalance: false }
    case constants.GAINS_BALANCE:
      return { isVsAccountBalanceSelected: true, isVSPrevDayBalance: true }
    default:
      return { isVsAccountBalanceSelected: false }
  }
}

class AverageWinLoss extends PureComponent {
  static propTypes = {
    currentFetchParams: PropTypes.shape({
      timeframe: PropTypes.string,
      isUnrealizedProfitExcluded: PropTypes.bool,
      isVsAccountBalanceSelected: PropTypes.bool,
    }),
    dataReceived: PropTypes.bool.isRequired,
    entries: PropTypes.arrayOf(PropTypes.shape({
      mts: PropTypes.number,
      USD: PropTypes.number,
    })),
    isFirstSyncing: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      timeframe: PropTypes.string,
      isUnrealizedProfitExcluded: PropTypes.bool,
      isVsAccountBalanceSelected: PropTypes.bool,
    }),
    refresh: PropTypes.func.isRequired,
    reportType: PropTypes.string.isRequired,
    setParams: PropTypes.func.isRequired,
    setReportType: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    currentFetchParams: {},
    entries: [],
    params: {},
  }

  componentDidMount() {
    checkInit(this.props, TYPE)
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, TYPE)
  }

  handleTimeframeChange = (timeframe) => {
    const { setParams } = this.props
    setParams({ timeframe })
  }

  handleUnrealizedProfitChange = (isUnrealizedProfitExcluded) => {
    const { setParams } = this.props
    setParams({ isUnrealizedProfitExcluded })
  }

  handleReportTypeChange = (type) => {
    const { setParams, setReportType } = this.props
    const params = getReportTypeParams(type)
    setReportType(type)
    setParams(params)
  }

  render() {
    const {
      t,
      entries,
      refresh,
      pageLoading,
      dataReceived,
      isFirstSyncing,
      currentFetchParams: {
        timeframe: currTimeframe,
      },
      params: {
        timeframe,
        isUnrealizedProfitExcluded,
        isVsAccountBalanceSelected,
      },
      reportType,
    } = this.props

    const { chartData, dataKeys } = prepareChartData(
      entries, currTimeframe, isVsAccountBalanceSelected, t,
    )

    let showContent
    if (isFirstSyncing) {
      showContent = <InitSyncNote />
    } else if (!dataReceived && pageLoading) {
      showContent = <Loading />
    } else if (isEmpty(entries)) {
      showContent = <NoData />
    } else {
      showContent = (
        <Chart
          data={chartData}
          dataKeys={dataKeys}
        />
      )
    }
    return (
      <Card
        elevation={Elevation.ZERO}
        className='col-lg-12 col-md-12 col-sm-12 col-xs-12'
      >
        <SectionHeader>
          <SectionHeaderTitle>
            {t('averagewinloss.title')}
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
                {t('selector.select')}
              </SectionHeaderItemLabel>
              <TimeFrameSelector
                value={timeframe}
                onChange={this.handleTimeframeChange}
              />
            </SectionHeaderItem>
            <SectionHeaderItem>
              <SectionHeaderItemLabel>
                {t('selector.unrealized-profits.title')}
              </SectionHeaderItemLabel>
              <UnrealizedProfitSelector
                value={isUnrealizedProfitExcluded}
                onChange={this.handleUnrealizedProfitChange}
              />
            </SectionHeaderItem>
            <SectionHeaderItem>
              <SectionHeaderItemLabel>
                {t('selector.report-type.title')}
              </SectionHeaderItemLabel>
              <ReportTypeSelector
                section={TYPE}
                value={reportType}
                onChange={this.handleReportTypeChange}
              />
            </SectionHeaderItem>
            <RefreshButton onClick={refresh} />
          </SectionHeaderRow>
        </SectionHeader>
        {showContent}
      </Card>
    )
  }
}

export default AverageWinLoss
