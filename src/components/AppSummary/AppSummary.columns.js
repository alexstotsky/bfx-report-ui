import React from 'react'
import { Cell } from '@blueprintjs/table'

import { formatFee } from 'ui/utils'
import { getTooltipContent } from 'utils/columns'

export const getFeesColumns = ({
  makerFee,
  isTurkishSite,
  derivTakerFee,
  takerFeeToFiat,
  takerFeeToStable,
  takerFeeToCrypto,
  derivMakerRebate,
}) => [
  {
    id: 'makerFee',
    name: 'summary.fees.maker',
    width: 100,
    renderer: () => (
      <Cell>
        {formatFee(makerFee)}
        %
      </Cell>
    ),
  },
  {
    id: 'takerFeeCrypto',
    name: 'summary.fees.taker_crypto',
    width: 140,
    renderer: () => (
      <Cell>
        {formatFee(takerFeeToCrypto)}
        %
      </Cell>
    ),
  },
  {
    id: 'takerFeeFiat',
    name: 'summary.fees.taker_fiat',
    width: 140,
    renderer: () => (
      <Cell>
        {formatFee(takerFeeToFiat)}
        %
      </Cell>
    ),
  },
  {
    id: 'takerFeeStable',
    name: 'summary.fees.taker_stables',
    width: 140,
    renderer: () => (
      <Cell>
        {formatFee(takerFeeToStable)}
        %
      </Cell>
    ),
  },
  ...(!isTurkishSite ? [{
    id: 'derivMakerRebate',
    name: 'summary.fees.deriv_maker',
    width: 140,
    renderer: () => (
      <Cell>
        {formatFee(derivMakerRebate)}
        %
      </Cell>
    ),
  },
  {
    id: 'derivTakerFee',
    name: 'summary.fees.deriv_taker',
    width: 140,
    renderer: () => (
      <Cell>
        {formatFee(derivTakerFee)}
        %
      </Cell>
    ),
  }] : []),
]

export const getAssetColumns = ({
  t,
  preparedData,
}) => [
  {
    id: 'currency',
    className: 'align-left',
    name: 'summary.by_asset.currency',
    width: 110,
    renderer: (rowIndex) => {
      const { currency } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(currency, t)}>
          {currency}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.currency,
  },
  {
    id: 'balance',
    name: 'summary.by_asset.amount',
    width: 178,
    renderer: (rowIndex) => {
      const { balance = null } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(balance, t)}>
          {balance}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.balance,
  },
  {
    id: 'balanceUsd',
    name: 'summary.by_asset.balance',
    width: 178,
    renderer: (rowIndex) => {
      const { balanceUsd } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(balanceUsd, t)}>
          {balanceUsd}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.balanceUsd,
  },
  {
    id: 'valueChange30dUsd',
    name: 'summary.by_asset.balance_change',
    width: 178,
    renderer: (rowIndex) => {
      const { valueChange30dUsd, valueChange30dPerc } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(valueChange30dUsd, t)}>
          {valueChange30dUsd}
          {valueChange30dPerc}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.valueChange30dUsd,
  },
  {
    id: 'result30dUsd',
    name: 'summary.by_asset.profits',
    width: 178,
    renderer: (rowIndex) => {
      const { result30dUsd, result30dPerc } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(result30dUsd, t)}>
          {result30dUsd}
          {result30dPerc}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.result30dUsd,
  },
  {
    id: 'volume30dUsd',
    name: 'summary.by_asset.volume',
    width: 178,
    renderer: (rowIndex) => {
      const { volume30dUsd } = preparedData[rowIndex]
      return (
        <Cell tooltip={getTooltipContent(volume30dUsd, t)}>
          {volume30dUsd}
        </Cell>
      )
    },
    copyText: rowIndex => preparedData[rowIndex]?.volume30dUsd,
  },
]
