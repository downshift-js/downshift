import * as React from 'react'

import {useSelect, useMultipleSelection} from '../../src'
import {type UseMultipleSelectionReturnValue} from '../../src/hooks/useMultipleSelection/index.types'
import {colors, getExampleLabelClassName} from '../utils'

const initialSelectedItems = colors.slice(0, 2)

function getFilteredItems(selectedItems: string[]) {
  return colors.filter(colour => !selectedItems.includes(colour))
}

export default function DropdownMultipleSelect() {
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({
    initialSelectedItems,
  }) as unknown as UseMultipleSelectionReturnValue<string>
  const items = getFilteredItems(selectedItems)
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: null,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    items,
    stateReducer: (state, actionAndChanges) => {
      const {changes, type} = actionAndChanges
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          }
        default:
          return changes
      }
    },
    onStateChange: ({type, selectedItem: newSelectedItem}) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            addSelectedItem(newSelectedItem)
          }
          break
        default:
          break
      }
    },
  })

  return (
    <div className="container">
      <label
        className={getExampleLabelClassName(selectedItem)}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div className="tag-group">
        {selectedItems.map(function renderSelectedItem(
          selectedItemForRender: string,
          index: number,
        ) {
          return (
            <span
              className="tag"
              key={`selected-item-${index}`}
              {...getSelectedItemProps({
                selectedItem: selectedItemForRender,
                index,
              })}
            >
              {selectedItemForRender}
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <span
                className="tag-remove-control"
                onClick={e => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItemForRender)
                }}
              >
                &#10005;
              </span>
            </span>
          )
        })}
        <div
          className="example-select-toggle"
          {...getToggleButtonProps(
            getDropdownProps({preventKeyAction: isOpen}),
          )}
        >
          Pick some colors {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </div>
      </div>
      <ul {...getMenuProps()} className="menu">
        {isOpen
          ? items.map((item, index) => (
              <li
                className={`example-menu-item${
                  highlightedIndex === index ? ' highlighted' : ''
                }`}
                key={`${item}${index}`}
                {...getItemProps({
                  item,
                  index,
                  'data-testid': `downshift-item-${index}`,
                })}
              >
                {item}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
