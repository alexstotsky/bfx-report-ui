import React from 'react'
import classNames from 'classnames'
import _round from 'lodash/round'

export const amountStyle = (amount) => {
  const val = parseFloat(amount)
  return classNames('bitfinex-text-align-right', {
    'bitfinex-green-text': val > 0,
    'bitfinex-red-text': val < 0,
  })
}

export const formatType = (type, amount) => {
  const classes = amountStyle(amount)
  return (
    // Fragment fixes blueprint's parentCellHeight warnings
    <>
      <span className={classes}>
        {type}
      </span>
    </>
  )
}

export const insertIf = (condition, ...elements) => (condition ? elements : [])

export const filterSelectorItem = (query, item) => item.toLowerCase().indexOf(query.toLowerCase()) >= 0

export const fixedFloat = (val, num = 8) => (typeof val === 'number' ? val && val.toFixed(num) : val)

export const formatThousands = (value) => {
  const parts = value.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// formats a number to a specified fraction or a min fraction with a room to grow without rounding
export const formatFraction = (value, options = {}) => {
  if (!value) {
    return value
  }
  const {
    digits = 8,
    minDigits = false,
  } = options
  if (minDigits) {
    const fractionLength = value.toString().split('.')[1].length || 0
    if (fractionLength < minDigits) {
      return fixedFloat(value, minDigits)
    }
    return value
  }
  return fixedFloat(value, digits)
}

export const formatAmount = (val, options = {}) => {
  if (!val) {
    return (
      <>
        <div className='bitfinex-amount'>
          {val}
        </div>
      </>
    )
  }
  const {
    color,
    digits = 8,
    minDigits = false,
    fixFraction = true,
    formatThousands: shouldFormatThousands = false,
    dollarSign = false,
  } = options
  let roundedValue = _round(val, 8)

  const classes = classNames('bitfinex-amount', {
    'bitfinex-green-text': color ? color === 'green' : roundedValue > 0,
    'bitfinex-red-text': color ? color === 'red' : roundedValue < 0,
  })

  if (fixFraction) {
    roundedValue = formatFraction(roundedValue, { digits, minDigits })
  }

  if (shouldFormatThousands) {
    roundedValue = formatThousands(roundedValue)
  }

  const [integer, fraction] = roundedValue.toString().split('.')

  return (
    <>
      <div className={classes}>
        <span>
          {dollarSign && '$'}
          {integer}
        </span>
        {fraction && (
          <>
            {'.'}
            <span className='bitfinex-amount-fraction'>{fraction}</span>
          </>
        )}
      </div>
    </>
  )
}

export const formatFee = (fee) => formatAmount(fee * 100, { color: 'white', minDigits: 2 })

export const formatColor = (value, color) => {
  const classes = classNames({
    'bitfinex-green-text': color === 'green',
    'bitfinex-red-text': color === 'red',
  })

  /* Fragment fixes blueprint's parentCellHeight warnings */
  return (
    <>
      <div className={classes}>
        {value}
      </div>
    </>
  )
}

export const formatExecPrice = (price) => {
  if (price >= 100) return price.toFixed(2)
  if (price >= 10) return price.toFixed(3)
  if (price >= 1) return price.toFixed(4)
  if (price < 0.0001) return price.toFixed(7)
  if (price < 1) return price.toFixed(5)
  return price.toFixed(2)
}

export default {
  fixedFloat,
  insertIf,
  formatAmount,
  formatFee,
  formatColor,
  formatExecPrice,
  formatFraction,
  formatThousands,
  amountStyle,
  filterSelectorItem,
}
