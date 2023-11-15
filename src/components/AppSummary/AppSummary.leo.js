import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Icon from 'icons'
import { fixedFloat } from 'ui/utils'
import { getData, getPageLoading } from 'state/accountSummary/selectors'

const AccountSummaryLeo = () => {
  const { t } = useTranslation()
  const data = useSelector(getData)
  const isLoading = useSelector(getPageLoading)
  const { leoLev = 0, leoAmountAvg = 0 } = data
  const formattedLeoAmount = fixedFloat(leoAmountAvg)

  return (
    <>
      {!isLoading && (
        <div className='leo-level'>
          <div className='leo-level--row'>
            <div className='leo-level--title'>
              <Icon.LEO />
              {`${t('summary.leo_level')} ${leoLev}`}
            </div>
          </div>
          <div className='leo-level--sub-title'>
            {`${t('summary.avg_amount')} ${formattedLeoAmount}`}
          </div>
        </div>
      )
    }
    </>
  )
}

export default AccountSummaryLeo
