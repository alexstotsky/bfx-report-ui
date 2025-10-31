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
import SectionSwitch from 'ui/SectionSwitch'
import TimeFrameSelector from 'ui/TimeFrameSelector'
import ClearFiltersButton from 'ui/ClearFiltersButton'
import MultiSymbolSelector from 'ui/MultiSymbolSelector'
import { parseLoanReportChartData } from 'ui/Charts/Charts.helpers'
import queryConstants from 'state/query/constants'
import {
  checkInit,
  checkFetch,
  toggleSymbol,
  clearAllSymbols,
} from 'state/utils'

const TYPE = queryConstants.MENU_LOAN_REPORT

class LoanReport extends PureComponent {
  static propTypes = {
    currentFetchParams: PropTypes.shape({
      timeframe: PropTypes.string,
      targetSymbols: PropTypes.arrayOf(PropTypes.string),
    }),
    entries: PropTypes.arrayOf(PropTypes.shape({
      mts: PropTypes.number.isRequired,
    })),
    targetSymbols: PropTypes.arrayOf(PropTypes.string),
    dataReceived: PropTypes.bool.isRequired,
    isFirstSyncing: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    params: PropTypes.shape({
      timeframe: PropTypes.string,
      targetSymbols: PropTypes.arrayOf(PropTypes.string),
    }),
    setParams: PropTypes.func.isRequired,
  }

  static defaultProps = {
    params: [],
    entries: [],
    targetSymbols: [],
    currentFetchParams: [],
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

  toggleSymbol = symbol => toggleSymbol(TYPE, this.props, symbol)

  clearSymbols = () => clearAllSymbols(TYPE, this.props)

  render() {
    const {
      t,
      params,
      entries,
      pageLoading,
      dataReceived,
      targetSymbols,
      isFirstSyncing,
      currentFetchParams: {
        timeframe: currTimeframe,
      },
    } = this.props
    const { timeframe } = params

    const { chartData, dataKeys } = parseLoanReportChartData({
      data: _sortBy(entries, ['mts']),
      timeframe: currTimeframe,
      t,
    })

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
            {t('loanreport.title')}
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
              <MultiSymbolSelector
                currentFilters={targetSymbols}
                toggleSymbol={this.toggleSymbol}
              />
            </SectionHeaderItem>
            <ClearFiltersButton onClick={this.clearSymbols} />
            <SectionHeaderItem>
              <SectionHeaderItemLabel>
                {t('selector.select')}
              </SectionHeaderItemLabel>
              <TimeFrameSelector
                value={timeframe}
                onChange={this.handleTimeframeChange}
              />
            </SectionHeaderItem>
          </SectionHeaderRow>
        </SectionHeader>
        {showContent}
      </Card>
    )
  }
}

export default LoanReport
