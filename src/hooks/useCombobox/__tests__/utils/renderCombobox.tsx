import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {dropdownDefaultProps} from '../../../utils'
import {dataTestIds, items} from '../../../testUtils'
import {UseComboboxProps} from '../../index.types'
import useCombobox from '../..'

type DropdownComboboxProps = Partial<UseComboboxProps<string>> & {
  renderSpy: jest.Mock
  renderItem?: (props: {
    index: number
    item: string
    getItemProps: ReturnType<typeof useCombobox>['getItemProps']
    stringItem: string
  }) => React.ReactNode
}

function DropdownCombobox({
  renderSpy,
  renderItem,
  ...props
}: DropdownComboboxProps) {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
  } = useCombobox({items, ...props})
  const itemToString =
    props.itemToString ??
    ((item: string | null) => dropdownDefaultProps.itemToString(item))

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
          ? (props.items ?? items).map((item, index) => {
              const stringItem = itemToString(item)
              return renderItem ? (
                renderItem({index, item, getItemProps, stringItem})
              ) : (
                <li
                  data-testid={dataTestIds.item(index)}
                  key={`${stringItem}${index}`}
                  {...(getItemProps({
                    item,
                    index,
                  }) as React.HTMLAttributes<HTMLLIElement>)}
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

export function renderCombobox(
  props: Omit<DropdownComboboxProps, 'renderSpy'> = {},
  uiCallback?: (ui: React.ReactElement) => React.ReactElement,
) {
  const renderSpy = jest.fn()
  const user = userEvent.setup({delay: null})
  const ui = <DropdownCombobox renderSpy={renderSpy} {...props} />
  const utils = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = (p: Omit<DropdownComboboxProps, 'renderSpy'>) =>
    utils.rerender(<DropdownCombobox renderSpy={renderSpy} {...p} />)

  return {
    ...utils,
    renderSpy,
    rerender,
    user,
  }
}

export function getInput() {
  return screen.getByRole('combobox')
}
