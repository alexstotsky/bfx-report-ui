import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import DataTable from 'ui/DataTable'

import { getColumns } from './Wallets.columns'
import { WALLETS_ENTRIES_PROPS } from './Wallets.props'
import constants from './var'

const {
  WALLET_EXCHANGE,
  WALLET_MARGIN,
  WALLET_FUNDING,
  WALLET_CONTRIBUTION,
  WALLET_CREDITLINE,
} = constants

const WalletsData = ({
  t,
  entries,
  isLoading,
}) => {
  const exchangeData = entries.filter(entry => entry.type === WALLET_EXCHANGE)
  const marginData = entries.filter(entry => entry.type === WALLET_MARGIN)
  const fundingData = entries.filter(entry => entry.type === WALLET_FUNDING)
  const contributionData = entries.filter(entry => entry.type === WALLET_CONTRIBUTION)
  const creditLineData = entries.filter(entry => entry.type === WALLET_CREDITLINE)

  console.log('+++creditLineData', creditLineData)

  const exchangeColumns = getColumns({
    filteredData: exchangeData, t, isNoData: isEmpty(exchangeData), isLoading,
  })
  const marginColumns = getColumns({
    filteredData: marginData, t, isNoData: isEmpty(marginData), isLoading,
  })
  const fundingColumns = getColumns({
    filteredData: fundingData, t, isNoData: isEmpty(fundingData), isLoading,
  })
  const contributionColumns = getColumns({
    filteredData: contributionData, t, isNoData: isEmpty(contributionData), isLoading,
  })

  return (
    <div className='wallets'>
      <div className='tables-row no-table-scroll'>
        <div className='tables-row-item'>
          <div>{t('wallets.header.exchange')}</div>
          <DataTable
            enableColumnResizing={false}
            tableColumns={exchangeColumns}
            numRows={exchangeData.length || 1}
          />
        </div>
        <div className='tables-row-item'>
          <div>{t('wallets.header.margin')}</div>
          <DataTable
            enableColumnResizing={false}
            tableColumns={marginColumns}
            numRows={marginData.length || 1}
          />
        </div>
        <div className='tables-row-item'>
          <div>{t('wallets.header.funding')}</div>
          <DataTable
            enableColumnResizing={false}
            tableColumns={fundingColumns}
            numRows={fundingData.length || 1}
          />
        </div>
        <div className='tables-row-item'>
          <div>{t('wallets.header.capital-raise')}</div>
          <DataTable
            enableColumnResizing={false}
            tableColumns={contributionColumns}
            numRows={contributionData.length || 1}
          />
        </div>
      </div>
    </div>
  )
}

WalletsData.propTypes = {
  t: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  entries: PropTypes.arrayOf(WALLETS_ENTRIES_PROPS).isRequired,
}

export default withTranslation('translations')(WalletsData)
