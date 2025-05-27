import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Cell } from '@blueprintjs/table'

import DataTable from 'ui/DataTable'
import { mapSymbol } from 'state/symbols/utils'
import { fixedFloat, formatAmount } from 'ui/utils'
import {
  COLUMN_WIDTHS,
  getCellLoader,
  getCellNoData,
  getTooltipContent,
} from 'utils/columns'

export const getColumns = ({
  t,
  data,
  isNoData,
  isLoading,
}) => [
  {
    id: 'currency',
    name: 'column.currency',
    className: 'align-left',
    width: window.innerWidth > 390
      ? 250
      : COLUMN_WIDTHS.SYMBOL,
    renderer: (rowIndex) => {
      if (isLoading) return getCellLoader(14, 72)
      if (isNoData) return getCellNoData(t('column.noResults'))
      const { curr } = data[rowIndex]
      const formattedCurrency = mapSymbol(curr)
      return (
        <Cell tooltip={getTooltipContent(formattedCurrency, t)}>
          {formattedCurrency}
        </Cell>
      )
    },
    copyText: rowIndex => mapSymbol(data[rowIndex].curr),
  },
  {
    id: 'volume',
    name: 'column.amount',
    width: COLUMN_WIDTHS.AMOUNT,
    renderer: (rowIndex) => {
      if (isLoading) return getCellLoader(14, 72)
      if (isNoData) return getCellNoData()
      const { curr, amount } = data[rowIndex]
      const fixedAmount = fixedFloat(amount)
      return (
        <Cell
          className='bitfinex-text-align-right'
          tooltip={getTooltipContent(fixedAmount, t)}
        >
          {formatAmount(amount, {
            digits: 2,
            formatThousands: true,
            dollarSign: curr === 'USD' || curr === 'Total (USD)',
          })}
        </Cell>
      )
    },
    copyText: rowIndex => fixedFloat(data[rowIndex].amount),
  },
]

const AccountSummaryPaidFees = ({
  t,
  data,
  total,
  title,
  isNoData,
  isLoading,
}) => {
  const formattedData = Object.keys(data).map(key => ({
    curr: key,
    amount: data[key],
  }))
  formattedData.push({
    curr: 'Total (USD)',
    amount: total,
  })

  const columns = getColumns({
    data: formattedData, t, isNoData, isLoading,
  })

  return (
    <div className='section-account-summary-data-item'>
      <div>{t(title)}</div>
      <DataTable
        tableColumns={columns}
        enableColumnResizing={false}
        numRows={isLoading ? 1 : formattedData.length}
      />
    </div>
  )
}

AccountSummaryPaidFees.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  isNoData: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default memo(AccountSummaryPaidFees)
