import {renderHook} from '@testing-library/react'

import {UseTagGroupProps, UseTagGroupReturnValue} from '../../index.types'
import useTagGroup from '../..'
import {defaultProps} from './defaultProps'

export function renderUseTagGroup(
  initialProps: Partial<UseTagGroupProps<string>> = {},
) {
  return renderHook<
    UseTagGroupReturnValue<string>,
    Partial<UseTagGroupProps<string>>
  >((props = {}) => useTagGroup(props), {
    initialProps: {...defaultProps, ...initialProps},
  })
}
