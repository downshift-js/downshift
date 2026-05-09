import {renderHook} from '@testing-library/react'
import {items} from '../../../testUtils'
import {UseComboboxProps} from '../../index.types'
import useCombobox from '../..'

export function renderUseCombobox(props?: Partial<UseComboboxProps<string>>) {
  return renderHook(() => useCombobox({items, ...props}))
}
