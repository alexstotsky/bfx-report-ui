import config from 'config'
import subAccountsTypes from 'state/subAccounts/constants'

import types from './constants'
import Authenticator from './Authenticator'

const { showFrameworkMode } = config

const initialAuthData = {
  apiKey: '',
  apiSecret: '',
  authToken: '',
  email: '',
  password: '',
  hasAuthData: false,
  isPersisted: true,
  isNotProtected: true,
  isSubAccount: false,
}

const getStoredAuth = () => {
  const auth = Authenticator.getStored()
  const {
    apiKey = '',
    apiSecret = '',
    authToken = '',
    email = '',
    password = '',
    hasAuthData = Authenticator.hasData(),
    isPersisted = true,
    isNotProtected = true,
    isSubAccount = false,
  } = auth

  return {
    apiKey,
    apiSecret,
    authToken,
    email,
    password,
    hasAuthData,
    isPersisted,
    isNotProtected,
    isSubAccount,
  }
}

const initialState = {
  authStatus: false,
  ...getStoredAuth(),
  token: '',
  isShown: true,
  loading: false,
  users: [],
  usersLoaded: false,
  usersLoading: false,
  subAccountsLoading: false,
  showOtpLogin: false,
  loginToken: '',
  userShouldReLogin: '',
  shouldNotSyncOnStartupAfterUpdate: false,
  isAuthBtnDisabled: false,
  isUserMerchant: false,
  authTokenTTLSec: types.DEFAULT_TOKEN_TTL,
}

export function authReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case types.FETCH_USERS:
      return {
        ...state,
        usersLoaded: false,
        usersLoading: true,
      }
    case types.ADD_USER:
      return {
        ...state,
        users: [...state.users, payload],
      }
    case subAccountsTypes.REMOVE_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => !(user.isSubAccount && user.email === payload)),
      }
    case subAccountsTypes.LOADING:
      return {
        ...state,
        subAccountsLoading: payload,
      }
    case types.SET_USERS:
      return {
        ...state,
        users: payload,
        usersLoaded: true,
        usersLoading: false,
      }
    case types.SIGN_UP:
    case types.SIGN_IN:
    case types.RECOVER_PASSWORD:
      return {
        ...state,
        loading: true,
      }
    case types.AUTH_SUCCESS:
      Authenticator.set({ ...payload, isPersisted: state.isPersisted })
      return {
        ...state,
        authStatus: true,
        loading: false,
        hasAuthData: true,
        ...payload,
      }
    case types.UPDATE_AUTH:
      return {
        ...state,
        ...payload,
      }
    case types.CLEAR_AUTH:
      Authenticator.clear()
      return {
        ...state,
        ...initialAuthData,
      }
    case types.UPDATE_AUTH_STATUS:
      return {
        ...state,
        authStatus: !!payload,
        loading: payload || false, // eject from loading if auth fail
      }
    case types.SHOW_AUTH:
      return {
        ...state,
        isShown: true,
        loading: false,
      }
    case types.SHOW_OTP_LOGIN:
      return {
        ...state,
        showOtpLogin: payload,
      }
    case types.SET_LOGIN_TOKEN:
      return {
        ...state,
        loginToken: payload,
      }
    case types.SET_USER_SHOULD_RE_LOGIN:
      return {
        ...state,
        userShouldReLogin: payload,
      }
    case types.SET_SYNC_AFTER_UPDATE:
      return {
        ...state,
        shouldNotSyncOnStartupAfterUpdate: payload,
      }
    case types.DISABLE_AUTH_BUTTON:
      return {
        ...state,
        isAuthBtnDisabled: payload,
      }
    case types.SET_TOKEN_TTL:
      return {
        ...state,
        authTokenTTLSec: payload,
      }
    case types.HIDE_AUTH:
      return {
        ...state,
        isShown: false,
        loading: false,
      }
    case types.LOGOUT:
      if (!showFrameworkMode) Authenticator.clearStored()
      return {
        ...initialState,
        ...getStoredAuth(),
        users: state.users,
        token: state.token,
        userShouldReLogin: state.userShouldReLogin,
      }
    default:
      return state
  }
}

export default authReducer
