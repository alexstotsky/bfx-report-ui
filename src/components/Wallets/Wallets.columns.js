import {
  getCell,
  getCellState,
  COLUMN_WIDTHS,
} from 'utils/columns'
import config from 'config'
import { insertIf, fixedFloat } from 'ui/utils'

export const getColumns = ({
  t,
  isNoData,
  isLoading,
  filteredData,
}) => [
  {
    id: 'currency',
    name: 'column.currency',
    className: 'align-left',
    width: 100,
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData, t('column.noResults'))
      const { currency } = filteredData[rowIndex]
      return getCell(currency, t)
    },
    copyText: rowIndex => filteredData[rowIndex].currency,
  },
  {
    id: 'balance',
    name: 'column.balance',
    width: COLUMN_WIDTHS.amount,
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const { balance } = filteredData[rowIndex]
      return getCell(fixedFloat(balance), t)
    },
    isNumericValue: true,
    copyText: rowIndex => fixedFloat(filteredData[rowIndex].balance),
  },
  ...insertIf(config.showFrameworkMode, (
    {
      id: 'balanceUsd',
      name: 'column.balanceUsd',
      width: COLUMN_WIDTHS.balanceUsd,
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { balanceUsd } = filteredData[rowIndex]
        return getCell(fixedFloat(balanceUsd), t)
      },
      isNumericValue: true,
      copyText: rowIndex => fixedFloat(filteredData[rowIndex].balanceUsd),
    }
  )),
]
