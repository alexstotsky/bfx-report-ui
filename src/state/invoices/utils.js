import { get } from '@bitfinex/lib-js-util-base'

import { mapSymbol } from 'state/symbols/utils'

export const updateInvoices = (state, payload) => {
  const res = get(payload, ['data', 'res'])
  if (!res) {
    return {
      ...state,
      dataReceived: true,
      pageLoading: false,
    }
  }

  const { existingCoins } = state
  const updateCoins = [...existingCoins]
  const entries = res.map((entry) => {
    const {
      id,
      amount,
      currency,
      customerInfo,
      duration,
      invoices,
      merchantName,
      orderId,
      payCurrencies,
      payment,
      redirectUrl,
      status,
      t,
      webhook,
    } = entry

    const mappedCurrency = mapSymbol(currency)
    // save new symbol to updateCoins list
    if (updateCoins.indexOf(mappedCurrency) === -1) {
      updateCoins.push(mappedCurrency)
    }
    return {
      id,
      amount,
      currency: mappedCurrency,
      customerInfo,
      duration,
      invoices,
      merchantName,
      orderId,
      payCurrencies,
      payment,
      redirectUrl,
      status,
      mts: t,
      webhook,
    }
  })

  return {
    ...state,
    dataReceived: true,
    pageLoading: false,
    entries: [...state.entries, ...entries],
    existingCoins: updateCoins.sort(),
  }
}

export default {
  updateInvoices,
}
