import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Select from 'ui/Select'

const SideSelector = ({
  className,
  onChange,
  value,
}) => {
  const { t } = useTranslation()

  const items = [
    { value: 1, label: t('floan.side.provided') },
    { value: 0, label: t('floan.side.both') },
    { value: -1, label: t('floan.side.taken') },
  ]

  return (
    <Select
      className={className}
      items={items}
      onChange={onChange}
      value={value}
    />
  )
}

SideSelector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

SideSelector.defaultProps = {
  className: '',
  value: '',
}

export default SideSelector
