import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { Card } from '@blueprintjs/core'

import AppDownload from 'components/AppDownload'
import AppSummary from 'components/AppSummary'
import AccountBalance from 'components/AccountBalance'
import AccountSummary from 'components/AccountSummary'
import AffiliatesEarnings from 'components/AffiliatesEarnings'
import AverageWinLoss from 'components/AverageWinLoss'
import Candles from 'components/Candles'
import ChangeLogs from 'components/ChangeLogs'
import ConcentrationRisk from 'components/ConcentrationRisk'
import Derivatives from 'components/Derivatives'
import FeesReport from 'components/FeesReport'
import ErrorDialog from 'components/ErrorDialog'
import FundingCreditHistory from 'components/FundingCreditHistory'
import FundingLoanHistory from 'components/FundingLoanHistory'
import FundingOfferHistory from 'components/FundingOfferHistory'
import FundingPayment from 'components/FundingPayment'
import GoToRangeDialog from 'components/GoToRangeDialog'
import Invoices from 'components/Invoices'
import Ledgers from 'components/Ledgers'
import LoanReport from 'components/LoanReport'
import Logins from 'components/Logins'
import Movements from 'components/Movements'
import Orders from 'components/Orders'
import OrderTrades from 'components/OrderTrades'
import PaginationDialog from 'components/PaginationDialog'
import Positions from 'components/Positions'
import PositionsActive from 'components/PositionsActive'
import PositionsAudit from 'components/PositionsAudit'
import PositionsAuditNoId from 'components/PositionsAudit/PositionsAudit.NoId'
import PublicFunding from 'components/PublicFunding'
import PublicTrades from 'components/PublicTrades'
import Snapshots from 'components/Snapshots'
import StakingPayments from 'components/StakingPayments'
import SubAccounts from 'components/SubAccounts'
import TaxReport from 'components/TaxReport'
import Tickers from 'components/Tickers'
import TradedVolume from 'components/TradedVolume'
import Trades from 'components/Trades'
import Wallets from 'components/Wallets'
import WeightedAverages from 'components/WeightedAverages'
import ExportDialog from 'components/ExportDialog'
import ExportSuccessDialog from 'components/ExportSuccessDialog'
import Preferences from 'components/Preferences'
import ExtraInfoDialog from 'components/ExtraInfoDialog'
import TimeFrameDialog from 'components/TimeFrameDialog'
import TaxPrecisionDialog from 'components/TaxPrecisionDialog'
import MaintenanceDialog from 'components/MaintenanceDialog'
import ExportFailDialog from 'components/ExportFailDialog'
import queryType from 'state/query/constants'
import { getPath } from 'state/query/utils'
import NavMenu from 'ui/NavMenu'
import NavMenuDrawer from 'ui/NavMenuDrawer'
import config from 'config'

const { showFrameworkMode } = config

const {
  MENU_ACCOUNT_BALANCE,
  MENU_ACCOUNT_SUMMARY,
  MENU_AFFILIATES_EARNINGS,
  MENU_CANDLES,
  MENU_CHANGE_LOGS,
  MENU_CONCENTRATION_RISK,
  MENU_DERIVATIVES,
  MENU_FCREDIT,
  MENU_FEES_REPORT,
  MENU_FLOAN,
  MENU_FOFFER,
  MENU_FPAYMENT,
  MENU_INVOICES,
  MENU_LEDGERS,
  MENU_LOAN_REPORT,
  MENU_LOGINS,
  MENU_ORDERS,
  MENU_ORDER_TRADES,
  MENU_TRADES,
  MENU_MOVEMENTS,
  MENU_POSITIONS,
  MENU_POSITIONS_ACTIVE,
  MENU_POSITIONS_AUDIT,
  MENU_PUBLIC_FUNDING,
  MENU_PUBLIC_TRADES,
  MENU_SNAPSHOTS,
  MENU_SPAYMENTS,
  MENU_SUB_ACCOUNTS,
  MENU_TAX_REPORT,
  MENU_TICKERS,
  MENU_TRADED_VOLUME,
  MENU_WALLETS,
  MENU_WEIGHTED_AVERAGES,
  MENU_WIN_LOSS,
} = queryType

const PATHS = {
  MENU_LEDGERS: [getPath(MENU_LEDGERS), `${getPath(MENU_LEDGERS)}/:symbol`],
  MENU_INVOICES: [getPath(MENU_INVOICES), `${getPath(MENU_INVOICES)}/:symbol`],
  MENU_CANDLES: [getPath(MENU_CANDLES)],
  MENU_TRADES: [getPath(MENU_TRADES), `${getPath(MENU_TRADES)}/:pair`],
  MENU_ORDERS: [getPath(MENU_ORDERS), `${getPath(MENU_ORDERS)}/:pair`],
  MENU_ORDER_TRADES: [getPath(MENU_ORDER_TRADES), `${getPath(MENU_ORDER_TRADES)}/:pair`],
  MENU_MOVEMENTS: [getPath(MENU_MOVEMENTS), `${getPath(MENU_MOVEMENTS)}/:symbol`],
  MENU_FCREDIT: [getPath(MENU_FCREDIT), `${getPath(MENU_FCREDIT)}/:symbol`],
  MENU_FLOAN: [getPath(MENU_FLOAN), `${getPath(MENU_FLOAN)}/:symbol`],
  MENU_FOFFER: [getPath(MENU_FOFFER), `${getPath(MENU_FOFFER)}/:symbol`],
  MENU_FPAYMENT: [getPath(MENU_FPAYMENT), `${getPath(MENU_FPAYMENT)}/:symbol`],
  MENU_SPAYMENTS: [getPath(MENU_SPAYMENTS), `${getPath(MENU_SPAYMENTS)}/:symbol`],
  MENU_AFFILIATES_EARNINGS: [getPath(MENU_AFFILIATES_EARNINGS), `${getPath(MENU_AFFILIATES_EARNINGS)}/:symbol`],
  MENU_PUBLIC_FUNDING: [getPath(MENU_PUBLIC_FUNDING), `${getPath(MENU_PUBLIC_FUNDING)}/:symbol`],
  MENU_PUBLIC_TRADES: [getPath(MENU_PUBLIC_TRADES), `${getPath(MENU_PUBLIC_TRADES)}/:pair`],
  MENU_TICKERS: [getPath(MENU_TICKERS), `${getPath(MENU_TICKERS)}/:pair`],
  MENU_DERIVATIVES: [getPath(MENU_DERIVATIVES), `${getPath(MENU_DERIVATIVES)}/:pair`],
  MENU_WEIGHTED_AVERAGES: [getPath(MENU_WEIGHTED_AVERAGES), `${getPath(MENU_WEIGHTED_AVERAGES)}/:pair`],
  MENU_POSITIONS: [getPath(MENU_POSITIONS), `${getPath(MENU_POSITIONS)}/:pair`],
  MENU_FEES_REPORT: [getPath(MENU_FEES_REPORT), `${getPath(MENU_FEES_REPORT)}/:symbol`],
  MENU_LOAN_REPORT: [getPath(MENU_LOAN_REPORT), `${getPath(MENU_LOAN_REPORT)}/:symbol`],
  MENU_TRADED_VOLUME: [getPath(MENU_TRADED_VOLUME), `${getPath(MENU_TRADED_VOLUME)}/:pair`],
  MENU_TAX_REPORT: [
    getPath(MENU_TAX_REPORT),
    `${getPath(MENU_TAX_REPORT)}/:section(result)`,
    `${getPath(MENU_TAX_REPORT)}/:section(start_snapshot|end_snapshot|result)/:subsection(positions|tickers|wallets)`],
  MENU_ACCOUNT_SUMMARY: [...getPath(MENU_ACCOUNT_SUMMARY)],
  MENU_LOGINS: [getPath(MENU_LOGINS)],
  MENU_CHANGE_LOGS: [getPath(MENU_CHANGE_LOGS)],
  MENU_SUB_ACCOUNTS: [getPath(MENU_SUB_ACCOUNTS)],
}

class Main extends PureComponent {
  static propTypes = {
    authIsShown: PropTypes.bool,
    authStatus: PropTypes.bool.isRequired,
    isTurkishSite: PropTypes.bool.isRequired,
    isSubAccsAvailable: PropTypes.bool.isRequired,
    errorDialogDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    authIsShown: false,
  }

  render() {
    const {
      authStatus,
      authIsShown,
      isTurkishSite,
      isSubAccsAvailable,
      errorDialogDisabled,
    } = this.props
    const showSubAccounts = showFrameworkMode && isSubAccsAvailable

    return authStatus && !authIsShown ? (
      <>
        <div className='nav-menu'>
          <Card className='nav-menu-card'>
            <NavMenu className='bitfinex-nav-menu--main' />
          </Card>
          {!showFrameworkMode && (
            <Card className='nav-menu-card app-download'>
              <AppDownload />
            </Card>
          )}
        </div>
        <div className='bitfinex-dataset'>
          <Switch>
            <Route
              exact
              path={PATHS.MENU_LEDGERS}
              component={Ledgers}
            />
            {!isTurkishSite && (
              <Route
                exact
                path={PATHS.MENU_INVOICES}
                component={Invoices}
              />
            )}
            <Route
              exact
              path={PATHS.MENU_CANDLES}
              component={Candles}
            />
            <Route
              exact
              path={PATHS.MENU_TRADES}
              component={Trades}
            />
            <Route
              exact
              path={PATHS.MENU_ORDERS}
              component={Orders}
            />
            <Route
              exact
              path={PATHS.MENU_ORDER_TRADES}
              component={OrderTrades}
            />
            <Route
              exact
              path={PATHS.MENU_MOVEMENTS}
              component={Movements}
            />
            {!isTurkishSite && (
              [
                <Route
                  exact
                  path={PATHS.MENU_FCREDIT}
                  component={FundingCreditHistory}
                  key={PATHS.MENU_FCREDIT}
                />,
                <Route
                  exact
                  path={PATHS.MENU_FLOAN}
                  component={FundingLoanHistory}
                  key={PATHS.MENU_FLOAN}
                />,
                <Route
                  exact
                  path={PATHS.MENU_FOFFER}
                  component={FundingOfferHistory}
                  key={PATHS.MENU_FOFFER}
                />,
                <Route
                  exact
                  path={PATHS.MENU_FPAYMENT}
                  component={FundingPayment}
                  key={PATHS.MENU_FPAYMENT}
                />,
                <Route
                  exact
                  path={PATHS.MENU_SPAYMENTS}
                  component={StakingPayments}
                  key={PATHS.MENU_SPAYMENTS}
                />,
              ]
            )}
            <Route
              exact
              path={PATHS.MENU_AFFILIATES_EARNINGS}
              component={AffiliatesEarnings}
            />
            {!isTurkishSite && (
              <Route
                exact
                path={PATHS.MENU_PUBLIC_FUNDING}
                component={PublicFunding}
              />
            )}
            <Route
              exact
              path={PATHS.MENU_PUBLIC_TRADES}
              component={PublicTrades}
            />
            <Route
              exact
              path={PATHS.MENU_TICKERS}
              component={Tickers}
            />
            {!isTurkishSite && (
              <Route
                exact
                path={PATHS.MENU_DERIVATIVES}
                component={Derivatives}
              />
            )}
            <Route
              exact
              path={getPath(MENU_POSITIONS_AUDIT)}
              component={PositionsAuditNoId}
            />
            <Route
              exact
              path={`${getPath(MENU_POSITIONS_AUDIT)}/:id`}
              component={PositionsAudit}
            />
            <Route
              exact
              path={getPath(MENU_POSITIONS_ACTIVE)}
              component={PositionsActive}
            />
            <Route
              exact
              path={PATHS.MENU_POSITIONS}
              component={Positions}
            />
            <Route
              exact
              path={getPath(MENU_WALLETS)}
              component={Wallets}
            />
            <Route
              exact
              path={PATHS.MENU_WEIGHTED_AVERAGES}
              component={WeightedAverages}
              key={MENU_WEIGHTED_AVERAGES}
            />
            {showFrameworkMode && (
              [
                <Route
                  exact
                  path={getPath(MENU_ACCOUNT_BALANCE)}
                  component={AccountBalance}
                  key={MENU_ACCOUNT_BALANCE}
                />,
                <Route
                  exact
                  path={PATHS.MENU_LOAN_REPORT}
                  component={LoanReport}
                  key={MENU_LOAN_REPORT}
                />,
                <Route
                  exact
                  path={PATHS.MENU_TRADED_VOLUME}
                  component={TradedVolume}
                  key={MENU_TRADED_VOLUME}
                />,
                <Route
                  exact
                  path={PATHS.MENU_FEES_REPORT}
                  component={FeesReport}
                  key={MENU_FEES_REPORT}
                />,
                <Route
                  exact
                  path={getPath(MENU_WIN_LOSS)}
                  component={AverageWinLoss}
                  key={MENU_WIN_LOSS}
                />,
                <Route
                  exact
                  path={getPath(MENU_CONCENTRATION_RISK)}
                  component={ConcentrationRisk}
                  key={MENU_CONCENTRATION_RISK}
                />,
                <Route
                  exact
                  path={getPath(MENU_SNAPSHOTS)}
                  component={Snapshots}
                  key={MENU_SNAPSHOTS}
                />,
                <Route
                  exact
                  path={PATHS.MENU_TAX_REPORT}
                  component={TaxReport}
                  key={MENU_TAX_REPORT}
                />,
              ]
            )}
            <Route
              exact
              path={PATHS.MENU_ACCOUNT_SUMMARY}
              component={showFrameworkMode ? AppSummary : AccountSummary}
            />
            <Route
              exact
              path={PATHS.MENU_LOGINS}
              component={Logins}
            />
            <Route
              exact
              path={PATHS.MENU_CHANGE_LOGS}
              component={ChangeLogs}
            />
            {showSubAccounts && (
              <Route
                exact
                path={PATHS.MENU_SUB_ACCOUNTS}
                component={SubAccounts}
              />
            )}
          </Switch>
        </div>
        <ExportDialog />
        <ExportSuccessDialog />
        {showFrameworkMode && !errorDialogDisabled && <ErrorDialog />}
        <PaginationDialog />
        <Preferences />
        <TimeFrameDialog />
        <GoToRangeDialog />
        <NavMenuDrawer />
        <ExtraInfoDialog />
        <ExportFailDialog />
        {showFrameworkMode && <MaintenanceDialog />}
        {showFrameworkMode && <TaxPrecisionDialog />}
      </>
    ) : ''
  }
}

export default Main
