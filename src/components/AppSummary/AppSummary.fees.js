import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import NoData from 'ui/NoData'
import Loading from 'ui/Loading'
import CollapsedTable from 'ui/CollapsedTable'
import {
  getData,
  getPageLoading,
  getDataReceived,
} from 'state/accountSummary/selectors'
import { getIsTurkishSite } from 'state/base/selectors'


import { getFeesColumns } from './AppSummary.columns'

const AppSummaryFees = () => {
  const { t } = useTranslation()
  const data = useSelector(getData)
  const pageLoading = useSelector(getPageLoading)
  const dataReceived = useSelector(getDataReceived)
  const isTurkishSite = useSelector(getIsTurkishSite)
  const {
    makerFee = 0,
    derivTakerFee = 0,
    takerFeeToFiat = 0,
    takerFeeToStable = 0,
    takerFeeToCrypto = 0,
    derivMakerRebate = 0,
  } = data

  const columns = getFeesColumns({
    makerFee,
    isTurkishSite,
    derivTakerFee,
    takerFeeToFiat,
    takerFeeToStable,
    takerFeeToCrypto,
    derivMakerRebate,
  })

  let showContent
  if (!dataReceived && pageLoading) {
    showContent = <Loading />
  } else if (isEmpty(data)) {
    showContent = <NoData />
  } else {
    showContent = (
      <CollapsedTable
        numRows={1}
        tableColumns={columns}
      />
    )
  }

  return (
    <div className='app-summary-item account-fees'>
      <div className='app-summary-item-title'>
        {t('summary.fees.title')}
      </div>
      <div className='app-summary-item-sub-title'>
        {t('summary.fees.sub_title')}
      </div>
      {showContent}
    </div>
  )
}

AppSummaryFees.propTypes = {
  data: PropTypes.shape({
    derivMakerRebate: PropTypes.number,
    derivTakerFee: PropTypes.number,
    makerFee: PropTypes.number,
    takerFeeToCrypto: PropTypes.number,
    takerFeeToFiat: PropTypes.number,
    takerFeeToStable: PropTypes.number,
  }).isRequired,
  pageLoading: PropTypes.bool.isRequired,
  dataReceived: PropTypes.bool.isRequired,
}

export default memo(AppSummaryFees)
