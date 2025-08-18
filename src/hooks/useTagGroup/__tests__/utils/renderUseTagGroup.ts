import {renderHook} from '@testing-library/react'

import {UseTagGroupProps} from '../../index.types'
import useTagGroup from '../..'
import {defaultProps} from './defaultProps'

export function renderUseTagGroup(
  initialProps: Partial<UseTagGroupProps<string>> = {},
) {
  return renderHook(
    (props: Partial<UseTagGroupProps<string>> = {}) => useTagGroup(props),
    {initialProps: {...defaultProps, ...initialProps}},
  )
}
