import {renderHook} from '@testing-library/react'

import {
  UseComboboxMergedProps,
  UseComboboxState,
  UseComboboxStateChange,
} from '../../index.types'
import {useControlledReducer} from '../useControlledReducer'
import {Reducer} from '../../../utils'
import downshiftUseComboboxReducer from '../../reducer'
import useCombobox from '../..'
import {getInitialState} from '../getInitialState'

const mockDispatchSpy = jest.fn()

jest.mock('../../../utils/useEnhancedReducer', () => {
  const actual = jest.requireActual<
    typeof import('../../../utils/useEnhancedReducer')
  >('../../../utils/useEnhancedReducer')

  return {
    useEnhancedReducer: jest.fn(
      (...args: Parameters<typeof actual.useEnhancedReducer>) => {
        const [state, dispatch] = actual.useEnhancedReducer(...args)

        mockDispatchSpy.mockImplementation(
          (action: Parameters<typeof dispatch>[0]) => {
            dispatch(action)
          },
        )

        return [state, mockDispatchSpy]
      },
    ),
  }
})

type ItemType = {value: string}

const props: UseComboboxMergedProps<ItemType> = {
  itemToString(item: ItemType | null) {
    return item ? item.value : ''
  },
  items: [],
  isItemDisabled() {
    return false
  },
  itemToKey(item: ItemType | null) {
    return item ? item.value : ''
  },
  stateReducer(_state, actionAndChanges) {
    return actionAndChanges.changes
  },
  scrollIntoView: jest.fn(),
  environment: window,
}
const reducer = downshiftUseComboboxReducer as Reducer<
  UseComboboxState<ItemType>,
  UseComboboxStateChange<ItemType>
>
const isStateEqual = jest.fn().mockReturnValue(false)

describe('useControlledReducer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return the initial state and a dispatch function', () => {
    const {result} = renderHook(() =>
      useControlledReducer(reducer, props, getInitialState, isStateEqual),
    )

    const [state, dispatch] = result.current

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: '',
      isOpen: false,
      selectedItem: null,
    })
    expect(typeof dispatch).toBe('function')
  })

  test('should update selectedItem and inputValue when selectedItem prop changes', () => {
    const {result, rerender} = renderHook(
      hookProps =>
        useControlledReducer(reducer, hookProps, getInitialState, isStateEqual),
      {initialProps: props},
    )

    const newSelectedItem = {value: 'new item'}
    rerender({
      ...props,
      selectedItem: newSelectedItem,
    })

    const [state, dispatch] = result.current

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: 'new item',
      isOpen: false,
      selectedItem: newSelectedItem,
    })
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
      type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
      inputValue: 'new item',
    })
  })

  test('should not update state if selectedItem prop is undefined', () => {
    const {result, rerender} = renderHook(
      hookProps =>
        useControlledReducer(reducer, hookProps, getInitialState, isStateEqual),
      {initialProps: props},
    )

    rerender({
      ...props,
      selectedItem: undefined,
    })

    const [state, dispatch] = result.current

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: '',
      isOpen: false,
      selectedItem: null,
    })
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('should not update state on first mount if selectedItem prop is set', () => {
    const initialProps = {
      ...props,
      selectedItem: {value: 'initial item'},
    }

    const {result} = renderHook(() =>
      useControlledReducer(
        reducer,
        initialProps,
        getInitialState,
        isStateEqual,
      ),
    )

    const [state, dispatch] = result.current

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: 'initial item',
      isOpen: false,
      selectedItem: {value: 'initial item'},
    })
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('should not update state if selectedItem prop changes to the same value', () => {
    const initialProps = {
      ...props,
      selectedItem: {value: 'initial item'},
    }
    const {result, rerender} = renderHook(
      hookProps =>
        useControlledReducer(reducer, hookProps, getInitialState, isStateEqual),
      {initialProps},
    )

    rerender({
      ...props,
      selectedItem: {value: 'initial item'},
    })

    const [state, dispatch] = result.current

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: 'initial item',
      isOpen: false,
      selectedItem: initialProps.selectedItem,
    })
    expect(dispatch).not.toHaveBeenCalled()
  })
})
