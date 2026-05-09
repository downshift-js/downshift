import * as React from 'react'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {dropdownDefaultProps} from '../../../utils'
import {dataTestIds, items} from '../../../testUtils'
import {UseSelectProps, UseSelectGetItemProps} from '../../index.types'
import useSelect from '../..'

type DropdownSelectProps = Omit<UseSelectProps<string>, 'items'> & {
  items?: string[]
  renderSpy: jest.Mock
  renderItem?: (props: {
    index: number
    item: string
    getItemProps: UseSelectGetItemProps<string>
    stringItem: string
  }) => React.ReactNode
}

function DropdownSelect({renderSpy, renderItem, ...props}: DropdownSelectProps) {
  const resolvedItems = props.items ?? items
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({...props, items: resolvedItems})
  const itemToString =
    props.itemToString ??
    ((item: string | null) => dropdownDefaultProps.itemToString(item))

  renderSpy()

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div data-testid={dataTestIds.toggleButton} {...getToggleButtonProps()}>
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {(selectedItem ? itemToString(selectedItem) : null) ?? 'Elements'}
      </div>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen
          ? resolvedItems.map((item, index) => {
              const stringItem = itemToString(item)
              return renderItem ? (
                renderItem({index, item, getItemProps, stringItem})
              ) : (
                <li
                  data-testid={dataTestIds.item(index)}
                  key={`${stringItem}${index}`}
                  {...(getItemProps({item, index}) as React.HTMLAttributes<HTMLLIElement>)}
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

export function renderSelect(
  props: Omit<DropdownSelectProps, 'renderSpy'>,
  uiCallback?: (ui: React.ReactElement) => React.ReactElement,
) {
  const renderSpy = jest.fn()
  const user = userEvent.setup({delay: null})
  const ui = <DropdownSelect renderSpy={renderSpy} {...props} />
  const utils = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = (p: Omit<DropdownSelectProps, 'renderSpy'>) =>
    utils.rerender(<DropdownSelect renderSpy={renderSpy} {...p} />)

  return {
    ...utils,
    renderSpy,
    rerender,
    user,
  }
}
