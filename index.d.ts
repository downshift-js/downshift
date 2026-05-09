// Downshift (legacy class component)
export * from './src/downshift.types'
import Downshift from './src/downshift.types'
export default Downshift

// useSelect
export * from './src/hooks/useSelect/index.types'
import {UseSelectInterface} from './src/hooks/useSelect/index.types'
export const useSelect: UseSelectInterface

// useCombobox
export * from './src/hooks/useCombobox/index.types'
import {UseComboboxInterface} from './src/hooks/useCombobox/index.types'
export const useCombobox: UseComboboxInterface

// useMultipleSelection
export * from './src/hooks/useMultipleSelection/index.types'
import {UseMultipleSelectionInterface} from './src/hooks/useMultipleSelection/index.types'
export const useMultipleSelection: UseMultipleSelectionInterface

// useTagGroup
export * from './src/hooks/useTagGroup/index.types'
import {UseTagGroupInterface} from './src/hooks/useTagGroup/index.types'
export const useTagGroup: UseTagGroupInterface
