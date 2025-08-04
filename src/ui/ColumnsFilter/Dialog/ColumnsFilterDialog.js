import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button, Classes, Dialog, Intent,
} from '@blueprintjs/core'

import Icon from 'icons'

import { propTypes, defaultProps } from './ColumnsFilterDialog.props'

const ColumnsFilterDialog = (props) => {
  const {
    children,
    isOpen,
    hasChanges,
    onClear,
    onCancel,
    onFiltersApply,
  } = props
  const { t } = useTranslation()

  return (
    <Dialog
      className='columns-filter-dialog'
      onClose={onCancel}
      title={t('columnsfilter.title')}
      icon={<Icon.FILTER />}
      isCloseButtonShown={false}
      isOpen={isOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        {children}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            onClick={onClear}
            className='columns-filter-clear'
          >
            {t('columnsfilter.clear')}
          </Button>
          <Button
            onClick={onCancel}
          >
            {t('columnsfilter.cancel')}
          </Button>
          <Button
            intent={Intent.PRIMARY}
            onClick={onFiltersApply}
            disabled={!hasChanges}
          >
            {t('columnsfilter.apply')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

ColumnsFilterDialog.propTypes = propTypes
ColumnsFilterDialog.defaultProps = defaultProps

export default ColumnsFilterDialog
