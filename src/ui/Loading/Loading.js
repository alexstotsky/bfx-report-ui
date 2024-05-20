import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '@blueprintjs/core'

export const Loading = (showProgress) => (
  <div className='loading-container'>
    {showProgress && (
    <div className='loading-progress'>
      100%
    </div>
    )}
    <Spinner
      className='loading'
      size={Spinner.SIZE_STANDARD}
    />
  </div>
)

Loading.propTypes = {
  showProgress: PropTypes.bool,
}

Loading.defaultProps = {
  showProgress: false,
}

export default Loading
