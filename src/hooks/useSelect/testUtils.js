import * as React from 'react'
import {render, act, renderHook} from '@testing-library/react'
import {defaultProps} from '../utils'
import {
  clickOnItemAtIndex,
  clickOnToggleButton,
  dataTestIds,
  items,
  keyDownOnToggleButton,
  mouseLeaveItemAtIndex,
  mouseMoveItemAtIndex,
  tab,
} from '../testUtils'
import * as stateChangeTypes from './stateChangeTypes'
import useSelect from '.'

export * from '../testUtils'

jest.mock('../utils', () => {
  const utils = jest.requireActual('../utils')
  const hooksUtils = jest.requireActual('../../utils')

  return {
    ...utils,
    useGetterPropsCalledChecker: () => hooksUtils.noop,
  }
})

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

beforeEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

export function renderUseSelect(props) {
  return renderHook(() => useSelect({items, ...props}))
}
export function renderSelect(props, uiCallback) {
  const renderSpy = jest.fn()
  const ui = <DropdownSelect renderSpy={renderSpy} {...props} />
  const utils = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = p =>
    utils.rerender(<DropdownSelect renderSpy={renderSpy} {...p} />)

  return {
    ...utils,
    renderSpy,
    rerender,
  }
}

export function DropdownSelect({renderSpy, renderItem, ...props}) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({items, ...props})
  const itemToString = props?.itemToString ?? defaultProps.itemToString

  renderSpy()

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div data-testid={dataTestIds.toggleButton} {...getToggleButtonProps()}>
        {(selectedItem && selectedItem instanceof Object
          ? itemToString(selectedItem)
          : selectedItem) || 'Elements'}
      </div>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen
          ? (props.items || items).map((item, index) => {
              const stringItem =
                item instanceof Object ? itemToString(item) : item
              return renderItem ? (
                renderItem({index, item, getItemProps, stringItem})
              ) : (
                <li
                  data-testid={dataTestIds.item(index)}
                  key={`${stringItem}${index}`}
                  {...getItemProps({item, index, disabled: item.disabled})}
                >
                  {stringItem}
                </li>
              )
            })
          : null}
      </ul>
    </div>
  )
}

/**
 * Return the id of the item that strats with the caracter.
 * @param {string} character The start of the item string.
 * @param {number} startIndex The index to start searching.
 * @returns number The index of the item.
 */
export function getItemIndexByCharacter(character, startIndex = 0) {
  return (
    items.slice(startIndex).findIndex(item => {
      // console.log(item.toLowerCase(), character.toLowerCase(), item.toLowerCase().startsWith(character.toLowerCase()))

      return item.toLowerCase().startsWith(character.toLowerCase())
    }) + startIndex
  )
}

export const stateChangeTestCases = [
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnter,
  },
  {
    step: keyDownOnToggleButton,
    arg: ' ',
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Escape}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownEscape,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{ArrowDown}',
    state: {
      isOpen: true,
      highlightedIndex: 0,
      inputValue: '',
      selectedItem: null,
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Enter}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[0],
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnter,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{End}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[0],
    },
    type: stateChangeTypes.ToggleButtonKeyDownEnd,
  },
  {
    step: keyDownOnToggleButton,
    arg: ' ',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownSpaceButton,
  },
  {
    step: clickOnToggleButton,
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{PageUp}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 11,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownPageUp,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{PageDown}',
    state: {
      isOpen: true,
      highlightedIndex: items.length - 1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ToggleButtonKeyDownPageDown,
  },
  {
    step: mouseMoveItemAtIndex,
    arg: items.length - 2,
    state: {
      isOpen: true,
      highlightedIndex: items.length - 2,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ItemMouseMove,
  },
  {
    step: mouseLeaveItemAtIndex,
    arg: items.length - 2,
    state: {
      isOpen: true,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.MenuMouseLeave,
  },
  {
    step: mouseMoveItemAtIndex,
    arg: 2,
    state: {
      isOpen: true,
      highlightedIndex: 2,
      inputValue: '',
      selectedItem: items[items.length - 1],
    },
    type: stateChangeTypes.ItemMouseMove,
  },
  {
    step: clickOnItemAtIndex,
    arg: 2,
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ItemClick,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowDown}{/Alt}',
    state: {
      isOpen: true,
      highlightedIndex: 2,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowDown}{/Alt}',
    state: {
      isOpen: true,
      highlightedIndex: 3,
      inputValue: '',
      selectedItem: items[2],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
  },
  {
    step: keyDownOnToggleButton,
    arg: '{Alt>}{ArrowUp}{/Alt}',
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[3],
    },
    type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
  },
  {
    step: keyDownOnToggleButton,
    arg: 'c',
    state: {
      isOpen: true,
      highlightedIndex: 5,
      inputValue: 'c',
      selectedItem: items[3],
    },
    type: stateChangeTypes.ToggleButtonKeyDownCharacter,
  },
  {
    step: () =>
      // just to have all steps async.
      new Promise(resolve => {
        act(() => jest.runAllTimers())
        resolve()
      }),
    state: {
      isOpen: true,
      highlightedIndex: 5,
      inputValue: '',
      selectedItem: items[3],
    },
    type: stateChangeTypes.FunctionSetInputValue,
  },
  {
    step: tab,
    state: {
      isOpen: false,
      highlightedIndex: -1,
      inputValue: '',
      selectedItem: items[5],
    },
    type: stateChangeTypes.ToggleButtonBlur,
  },
]
