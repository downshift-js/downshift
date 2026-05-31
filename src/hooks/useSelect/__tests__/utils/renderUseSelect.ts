import {renderHook} from '@testing-library/react'
import {items} from '../../../testUtils'
import {UseSelectProps} from '../../index.types'
import useSelect from '../..'

export function renderUseSelect(props?: Partial<UseSelectProps<string>>) {
  return renderHook(() => useSelect({items, ...props}))
}
