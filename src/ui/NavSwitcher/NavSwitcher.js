import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _map from 'lodash/map'
import { isEqual } from '@bitfinex/lib-js-util-base'

import { tracker } from 'utils/trackers'

const NavSwitcher = ({
  items,
  onChange,
  value: activeItem,
}) => {
  const handleClick = (itemValue) => {
    tracker.trackEvent(itemValue, 'Tab')
    onChange(itemValue)
  }

  return (
    <div className='nav-switcher'>
      {_map(items, (item) => {
        const { label, value: itemValue } = item
        const itemClasses = classNames('nav-switcher-item', {
          'nav-switcher-item--active': isEqual(itemValue, activeItem),
        })

        return (
          <span
            key={itemValue}
            className={itemClasses}
            onClick={() => handleClick(itemValue)}
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

NavSwitcher.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default memo(NavSwitcher)
