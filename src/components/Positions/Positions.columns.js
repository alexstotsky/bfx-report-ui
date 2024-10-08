import _endsWith from 'lodash/endsWith'

import queryConstants from 'state/query/constants'
import { formatAmount, fixedFloat } from 'ui/utils'
import {
  getCell,
  getCellState,
  getActionCell,
  getColumnWidth,
  getJsonFormattedCell,
} from 'utils/columns'

const { MENU_POSITIONS_ACTIVE, MENU_POSITIONS_AUDIT } = queryConstants

export default function getColumns(props) {
  const {
    t,
    target,
    isNoData,
    isLoading,
    onIdClick,
    timeOffset,
    getFullTime,
    filteredData,
    columnsWidth,
  } = props

  function showType(data) {
    const { marginFundingType, pair } = data

    if (_endsWith(pair, 'PERP')) {
      return t('positions.swap.period')
    }

    return marginFundingType
      ? t('positions.swap.term')
      : t('positions.swap.daily')
  }

  const ACTIVE_POSITIONS_COLS = (target === MENU_POSITIONS_ACTIVE)
    ? [
      {
        id: 'liquidationPrice',
        name: 'column.liq-price',
        width: getColumnWidth('liquidationPrice', columnsWidth),
        renderer: (rowIndex) => {
          if (isLoading || isNoData) return getCellState(isLoading, isNoData)
          const { liquidationPrice } = filteredData[rowIndex]
          return getCell(fixedFloat(liquidationPrice), t)
        },
        isNumericValue: true,
        copyText: rowIndex => fixedFloat(filteredData[rowIndex].liquidationPrice),
      },
      {
        id: 'pl',
        name: 'column.pl',
        width: getColumnWidth('pl', columnsWidth),
        renderer: (rowIndex) => {
          if (isLoading || isNoData) return getCellState(isLoading, isNoData)
          const { pl } = filteredData[rowIndex]
          return getCell(formatAmount(pl), t, fixedFloat(pl))
        },
        isNumericValue: true,
        copyText: rowIndex => fixedFloat(filteredData[rowIndex].pl),
      },
      {
        id: 'plPerc',
        name: 'column.plperc',
        width: getColumnWidth('plPerc', columnsWidth),
        renderer: (rowIndex) => {
          if (isLoading || isNoData) return getCellState(isLoading, isNoData)
          const { plPerc } = filteredData[rowIndex]
          return getCell(formatAmount(plPerc), t, fixedFloat(plPerc))
        },
        isNumericValue: true,
        copyText: rowIndex => fixedFloat(filteredData[rowIndex].plPerc),
      },
    ]
    : []

  const COLLATERAL_META = (target === MENU_POSITIONS_ACTIVE || target === MENU_POSITIONS_AUDIT)
    ? [
      {
        id: 'collateral',
        name: 'column.collateral',
        width: getColumnWidth('collateral', columnsWidth),
        renderer: (rowIndex) => {
          if (isLoading || isNoData) return getCellState(isLoading, isNoData)
          const { collateral } = filteredData[rowIndex]
          return getCell(fixedFloat(collateral), t)
        },
        isNumericValue: true,
        copyText: rowIndex => fixedFloat(filteredData[rowIndex].collateral),
      },
      {
        id: 'meta',
        name: 'column.meta',
        className: 'align-left',
        width: getColumnWidth('meta', columnsWidth),
        renderer: (rowIndex) => {
          if (isLoading || isNoData) return getCellState(isLoading, isNoData)
          const { meta = '' } = filteredData[rowIndex]
          return getJsonFormattedCell(meta)
        },
        copyText: rowIndex => JSON.stringify(filteredData[rowIndex].meta) || '',
      },
    ]
    : []

  return [
    {
      id: 'id',
      name: 'column.id',
      className: 'align-left',
      width: getColumnWidth('id', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { id } = filteredData[rowIndex]
        return getActionCell(id, onIdClick, t)
      },
      copyText: rowIndex => filteredData[rowIndex].id,
    },
    {
      id: 'pair',
      name: 'column.pair',
      className: 'align-left',
      width: getColumnWidth('pair', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { pair } = filteredData[rowIndex]
        return getCell(pair, t)
      },
      copyText: rowIndex => filteredData[rowIndex].pair,
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
      id: 'basePrice',
      name: 'column.base-price',
      width: getColumnWidth('basePrice', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { basePrice } = filteredData[rowIndex]
        return getCell(fixedFloat(basePrice), t)
      },
      isNumericValue: true,
      copyText: rowIndex => fixedFloat(filteredData[rowIndex].basePrice),
    },
    ...ACTIVE_POSITIONS_COLS,
    {
      id: 'marginFunding',
      name: 'column.fundingCost',
      width: getColumnWidth('marginFunding', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { marginFunding } = filteredData[rowIndex]
        return getCell(fixedFloat(marginFunding), t)
      },
      isNumericValue: true,
      copyText: rowIndex => fixedFloat(filteredData[rowIndex].marginFunding),
    },
    {
      id: 'marginFundingType',
      name: 'column.fundingType',
      className: 'align-left',
      width: getColumnWidth('marginFundingType', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const swapType = showType(filteredData[rowIndex])
        return getCell(swapType, t)
      },
      copyText: rowIndex => showType(filteredData[rowIndex]),
    },
    {
      id: 'status',
      name: 'column.status',
      className: 'align-left',
      width: getColumnWidth('status', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const { status } = filteredData[rowIndex]
        return getCell(status, t)
      },
      copyText: rowIndex => filteredData[rowIndex].status,
    },
    {
      id: 'mtsUpdate',
      className: 'align-left',
      nameStr: `${t('column.updated')} (${timeOffset})`,
      width: getColumnWidth('mtsUpdate', columnsWidth),
      renderer: (rowIndex) => {
        if (isLoading || isNoData) return getCellState(isLoading, isNoData)
        const timestamp = getFullTime(filteredData[rowIndex].mtsUpdate)
        return getCell(timestamp, t)
      },
      copyText: rowIndex => getFullTime(filteredData[rowIndex].mtsUpdate),
    },
    ...COLLATERAL_META,
  ]
}
