import * as React from 'react'

import {useSelect, useMultipleSelection} from '../../src'
import {
  colors,
  containerStyles,
  menuStyles,
  selectedItemsContainerSyles,
  selectedItemStyles,
} from '../utils'

const initialSelectedItems = [colors[0], colors[1]]

function getFilteredItems(selectedItems) {
  return colors.filter(colour => !selectedItems.includes(colour))
}

export default function DropdownMultipleSelect() {
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({initialSelectedItems})
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
    <div style={containerStyles}>
      <label
        style={{
          fontWeight: 'bolder',
          color: selectedItem ? selectedItem : 'black',
        }}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div style={selectedItemsContainerSyles}>
        {selectedItems.map(function renderSelectedItem(
          selectedItemForRender,
          index,
        ) {
          return (
            <span
              style={selectedItemStyles}
              key={`selected-item-${index}`}
              {...getSelectedItemProps({
                selectedItem: selectedItemForRender,
                index,
              })}
            >
              {selectedItemForRender}
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <span
                style={{padding: '4px', cursor: 'pointer'}}
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
          style={{
            padding: '4px',
            textAlign: 'center',
            border: '1px solid black',
            backgroundColor: 'lightgray',
            cursor: 'pointer',
          }}
          type="button"
          {...getToggleButtonProps(
            getDropdownProps({preventKeyAction: isOpen}),
          )}
        >
          Pick some colors {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </div>
      </div>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen
          ? items.map((item, index) => (
              <li
                style={{
                  padding: '4px',
                  backgroundColor:
                    highlightedIndex === index ? '#bde4ff' : null,
                }}
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
