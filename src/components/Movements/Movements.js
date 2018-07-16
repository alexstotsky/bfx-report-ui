import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import {
  Button,
  Card,
  Elevation,
} from '@blueprintjs/core'
import {
  Cell,
  Column,
  Table,
  TruncatedFormat,
} from '@blueprintjs/table'
import Loading from 'components/Loading'
import NoData from 'components/NoData'
import { formatTime } from 'state/utils'
import { propTypes, defaultProps } from './Movements.props'
import Inspector from './Inspector'

// const TYPE_DEPOSITS = 'deposits'
const TYPE_WITHDRAWALS = 'withdrawals'

export const Movements = ({
  entries,
  intl,
  type,
  loading,
}) => {
  const filteredData = entries.filter(entry => (type === TYPE_WITHDRAWALS
    ? parseFloat(entry.amount) < 0 : parseFloat(entry.amount) > 0))
  const numRows = filteredData.length

  const idCellRenderer = rowIndex => (
    <Cell>
      {entries[rowIndex].id}
    </Cell>
  )

  const mtsUpdatedCellRenderer = rowIndex => (
    <Cell>
      <TruncatedFormat>
        {formatTime(entries[rowIndex].mtsUpdated)}
      </TruncatedFormat>
    </Cell>
  )

  const amountCellRenderer = rowIndex => (
    <Cell>
      {entries[rowIndex].amount}
    </Cell>
  )

  const statusCellRenderer = rowIndex => (
    <Cell>
      {entries[rowIndex].status}
    </Cell>
  )

  const destinationCellRenderer = (rowIndex) => {
    const entry = filteredData[rowIndex]
    return (
      <Cell>
        {entry.destinationAddress}
        &nbsp;
        <Inspector currency={entry.currency} destinationAddress={entry.destinationAddress} />
      </Cell>
    )
  }

  const titleMsgId = type === TYPE_WITHDRAWALS
    ? 'movements.withdrawals.title' : 'movements.deposits.title'
  let showContent
  if (loading) {
    showContent = (
      <Loading title={titleMsgId} />
    )
  } else if (numRows === 0) {
    showContent = (
      <NoData title={titleMsgId} />
    )
  } else {
    showContent = (
      <Fragment>
        <h4>
          {intl.formatMessage({ id: titleMsgId })}
          &nbsp;
          <Button icon='cloud-download' disabled>
            {intl.formatMessage({ id: 'timeframe.download' })}
          </Button>
        </h4>
        <Table className='bitfinex-table' numRows={numRows} enableRowHeader={false}>
          <Column
            id='id'
            name='#'
            cellRenderer={idCellRenderer}
          />
          <Column
            id='mtsupdated'
            name={intl.formatMessage({ id: 'movements.column.updated' })}
            cellRenderer={mtsUpdatedCellRenderer}
          />
          <Column
            id='amount'
            name={intl.formatMessage({ id: 'movements.column.amount' })}
            cellRenderer={amountCellRenderer}
          />
          <Column
            id='status'
            name={intl.formatMessage({ id: 'movements.column.status' })}
            cellRenderer={statusCellRenderer}
          />
          <Column
            id='destination'
            name={intl.formatMessage({ id: 'movements.column.destination' })}
            cellRenderer={destinationCellRenderer}
          />
        </Table>
      </Fragment>
    )
  }
  return (
    <Card interactive elevation={Elevation.ZERO} className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
      {showContent}
    </Card>
  )
}

Movements.propTypes = propTypes
Movements.defaultProps = defaultProps

export default injectIntl(Movements)
