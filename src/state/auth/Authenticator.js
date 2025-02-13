import { isEmpty, pick } from '@bitfinex/lib-js-util-base'

import config from 'config'

const PERSISTED_PARAMS_WEB = [
  'apiKey',
  'apiSecret',
  'authToken',
]

const PERSISTED_PARAMS_FRAMEWORK = [
  'email',
  'password',
  'isNotProtected',
  'isSubAccount',
]

class Authenticator {
  clear = () => {
    const auth = this.getStored()
    const persistedData = {
      isPersisted: auth.isPersisted,
    }

    this.persist(persistedData)
  }

  getStored = () => {
    const auth = window.localStorage.getItem('auth')
    return auth ? JSON.parse(auth) : {}
  }

  clearStored = () => {
    window.localStorage.removeItem('auth')
  }

  hasData = () => {
    const storedData = this.getStored()
    const storedKeys = Object.keys(storedData)
    const isDataEmpty = isEmpty(storedData)
    const hasSingleKey = storedKeys.length === 1 && storedKeys.includes('isPersisted')

    return !isDataEmpty && !hasSingleKey
  }

  persist = (data) => {
    window.localStorage.setItem('auth', JSON.stringify(data))
  }

  set = (data) => {
    const auth = this.getStored()
    const { apiKey, apiSecret, isPersisted } = data

    if (!isPersisted) {
      this.persist({
        isPersisted: false,
      })
      return
    }

    const persistedParams = config.showFrameworkMode ? PERSISTED_PARAMS_FRAMEWORK : PERSISTED_PARAMS_WEB
    const persistedData = {
      ...auth,
      isPersisted: true,
      ...pick(data, persistedParams),
    }

    // remove auth token after successful auth with apiKey and apiSecret
    if (!config.showFrameworkMode && apiKey && apiSecret) {
      persistedData.authToken = ''
    }

    this.persist(persistedData)
  }
}

export default new Authenticator()
