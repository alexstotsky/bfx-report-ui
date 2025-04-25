import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Checkbox,
  Classes,
  Dialog,
  Intent,
} from '@blueprintjs/core'
import { isEqual } from '@bitfinex/lib-js-util-base'

import Icon from 'icons'
import { tracker } from 'utils/trackers'

// import { FIRST_SYNC_ERROR } from './ErrorDialog.constants'

const ErrorDialog = ({
  t,
  isOpen,
  isSyncing,
  startSync,
  isDisabled,
  errorMessage,
  toggleDialog,
  disableDialog,
}) => {
  const [isDialogDisabled, setIsDialogDisabled] = useState(isDisabled)
  // const isFirstSync = isEqual(FIRST_SYNC_ERROR, errorMessage)
  // const shouldStartSync = isFirstSync && isOpen && !isSyncing

  // useEffect(() => {
  //   if (shouldStartSync) startSync()
  // }, [])

  const handleClose = () => {
    tracker.trackEvent('Okay')
    toggleDialog(false)
    disableDialog(isDialogDisabled)
  }

  const handleChange = (e) => {
    tracker.trackEvent('Don\'t show this message again')
    const { checked } = e.target
    setIsDialogDisabled(checked)
  }

  return (
    <Dialog
      className='error-dialog'
      icon={<Icon.INFO_CIRCLE />}
      onClose={handleClose}
      title={isFirstSync ? t('framework.sync-in-progress') : t('framework.warning')}
      isCloseButtonShown={false}
      isOpen={true}
    >
      <div className={Classes.DIALOG_BODY}>
        <div className='error-dialog-message'>
          {isFirstSync ? t('framework.first-sync-message') : errorMessage}
        </div>
        <Checkbox
          checked={isDialogDisabled}
          onChange={handleChange}
          label={t('framework.notagain')}
          className='error-dialog-checkbox'
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent={Intent.PRIMARY} onClick={handleClose}>
            {isFirstSync ? t('framework.okay_btn') : t('framework.continue')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

ErrorDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSyncing: PropTypes.bool.isRequired,
  startSync: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  disableDialog: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  t: PropTypes.func.isRequired,
}

ErrorDialog.defaultProps = {
  errorMessage: 'Something went wrong',
}

export default memo(ErrorDialog)
