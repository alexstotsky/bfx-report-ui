import { formatPair } from 'state/symbols/utils'
import { formatAmount, fixedFloat, formatType } from 'ui/utils'
import { getCell, getCellState, getColumnWidth } from 'utils/columns'

export const getColumns = ({
  t,
  isNoData,
  isLoading,
  targetPair,
  timeOffset,
  getFullTime,
  filteredData,
  columnsWidth,
}) => [
  {
    id: 'id',
    name: 'column.id',
    className: 'align-left',
    width: getColumnWidth('id', columnsWidth),
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const { id } = filteredData[rowIndex]
      return getCell(id, t)
    },
    copyText: rowIndex => filteredData[rowIndex].id,
  },
  {
    id: 'mts',
    className: 'align-left',
    nameStr: `${t('column.time')} (${timeOffset})`,
    width: getColumnWidth('mts', columnsWidth),
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const timestamp = getFullTime(filteredData[rowIndex].mts)
      return getCell(timestamp, t)
    },
    copyText: rowIndex => getFullTime(filteredData[rowIndex].mts),
  },
  {
    id: 'type',
    name: 'column.type',
    className: 'align-left',
    width: getColumnWidth('type', columnsWidth),
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const { type, amount } = filteredData[rowIndex]
      return getCell(formatType(type, amount), t, type)
    },
    copyText: rowIndex => filteredData[rowIndex].type,
  },
  {
    id: 'price',
    name: 'column.price',
    width: getColumnWidth('price', columnsWidth),
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const { price } = filteredData[rowIndex]
      return getCell(formatAmount(price), t, fixedFloat(price))
    },
    isNumericValue: true,
    copyText: rowIndex => fixedFloat(filteredData[rowIndex].price),
  },
  {
    id: 'amount',
    name: 'column.amount',
    width: getColumnWidth('amount', columnsWidth),
    renderer: (rowIndex) => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      const { amount } = filteredData[rowIndex]
      return getCell(formatAmount(amount), t, fixedFloat(amount))
    },
    isNumericValue: true,
    copyText: rowIndex => fixedFloat(filteredData[rowIndex].amount),
  },
  {
    id: 'pair',
    name: 'column.pair',
    className: 'align-left',
    width: getColumnWidth('pair', columnsWidth),
    renderer: () => {
      if (isLoading || isNoData) return getCellState(isLoading, isNoData)
      return getCell(formatPair(targetPair), t)
    },
    copyText: () => formatPair(targetPair),
  },
]
