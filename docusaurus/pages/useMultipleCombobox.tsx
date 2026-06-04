import * as React from 'react'

import {useCombobox, useMultipleSelection} from '../../src'
import {type UseMultipleSelectionReturnValue} from '../../src/hooks/useMultipleSelection/index.types'
import {colors} from '../utils'

const initialSelectedItems = colors.slice(0, 2)

function getFilteredItems(selectedItems: string[], inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase()

  return colors.filter(
    colour =>
      !selectedItems.includes(colour) &&
      colour.toLowerCase().startsWith(lowerCasedInputValue),
  )
}

export default function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems)
  const items = React.useMemo(
    () => getFilteredItems(selectedItems, inputValue),
    [selectedItems, inputValue],
  )

  const {getSelectedItemProps, getDropdownProps, removeSelectedItem} =
    useMultipleSelection({
      initialSelectedItems,
    }) as unknown as UseMultipleSelectionReturnValue<string>
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    reset,
  } = useCombobox({
    items,
    inputValue,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const {changes, type} = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {isOpen: true, highlightedIndex: 0}),
          }
        default:
          return changes
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          setSelectedItems([...selectedItems, newSelectedItem as string])

          break
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue as string)
          break
        default:
          break
      }
    },
  })
  return (
    <div className="container">
      <label
        style={{
          fontWeight: 'bolder',
          color: selectedItem ? selectedItem : 'black',
        }}
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
        <div>
          <input
            style={{padding: '4px'}}
            {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
            data-testid="combobox-input"
          />
          <button
            style={{padding: '4px 8px'}}
            aria-label="toggle menu"
            data-testid="combobox-toggle-button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
          <button
            style={{padding: '4px 8px'}}
            aria-label="clear selection"
            data-testid="clear-button"
            onClick={() => reset()}
          >
            &#10007;
          </button>
        </div>
      </div>
      <ul {...getMenuProps()} className="menu">
        {isOpen
          ? items.map((item, index) => (
              <li
                style={{
                  padding: '4px',
                  backgroundColor:
                    highlightedIndex === index ? '#bde4ff' : undefined,
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
