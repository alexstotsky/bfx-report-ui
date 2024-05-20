import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '@blueprintjs/core'

export const Loading = ({ showProgress }) => (
  <div className='loading-container'>
    {showProgress && (
      <div className='loading-progress'>
        75%
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
  showProgress: true,
}

export default Loading
