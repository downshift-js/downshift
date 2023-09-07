import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import {defaultProps} from '../utils'
import {dataTestIds, items, user} from '../testUtils'
import useCombobox from '.'

export * from '../testUtils'

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

jest.mock('../utils', () => {
  const utils = jest.requireActual('../utils')
  const hooksUtils = jest.requireActual('../../utils')

  return {
    ...utils,
    useGetterPropsCalledChecker: () => hooksUtils.noop,
  }
})

beforeEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

export function getInput() {
  return screen.getByRole('combobox')
}

export async function keyDownOnInput(keys) {
  if (document.activeElement !== getInput()) {
    getInput().focus()
  }

  await user.keyboard(keys)
}

export async function changeInputValue(inputValue) {
  if (document.activeElement !== getInput()) {
    getInput().focus()
  }

  await user.keyboard(inputValue)
}

export async function clickOnInput() {
  await user.click(getInput())
}

export const renderCombobox = (props, uiCallback) => {
  const renderSpy = jest.fn()
  const ui = <DropdownCombobox renderSpy={renderSpy} {...props} />
  const utils = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = newProps =>
    utils.rerender(<DropdownCombobox renderSpy={renderSpy} {...newProps} />)

  return {
    ...utils,
    renderSpy,
    rerender,
  }
}

function DropdownCombobox({renderSpy, renderItem, ...props}) {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
  } = useCombobox({items, ...props})
  const {itemToString} = props.itemToString ? props : defaultProps

  renderSpy()

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div>
        <input data-testid={dataTestIds.input} {...getInputProps()} />
        <button
          data-testid={dataTestIds.toggleButton}
          {...getToggleButtonProps()}
        >
          Toggle
        </button>
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

export const renderUseCombobox = props => {
  return renderHook(() => useCombobox({items, ...props}))
}

// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialFocusAndOpenTestCases = [
  [undefined, undefined, true, true],
  [true, true, true, true],
  [true, false, true, true],
  [false, true, true, true],
  [false, false, true, true],

  [true, undefined, undefined, true],
  [true, false, undefined, true],
  [true, true, undefined, true],

  [undefined, true, undefined, true],
]

// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialNoFocusOrOpenTestCases = [
  [undefined, undefined, undefined, false],
  [undefined, undefined, false, false],
  [true, true, false, false],
  [true, false, false, false],
  [false, true, false, false],
  [false, false, false, false],
  [false, undefined, undefined, false],
  [false, false, undefined, false],
  [false, true, undefined, false],
  [undefined, false, undefined, false],
]
