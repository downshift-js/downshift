import * as React from 'react'

import {useTagGroup, useCombobox} from '../..'
import {colors} from '../utils'

import './useTagGroupCombobox.css'

export default function TagGroup() {
  const initialItems = colors.slice(0, 5)
  const [inputValue, setInputValue] = React.useState('')
  const {
    addItem,
    getTagProps,
    getTagRemoveProps,
    getTagGroupProps,
    items,
    activeIndex,
  } = useTagGroup({initialItems})

  const itemsToAdd = colors.filter(
    color =>
      !items.includes(color) &&
      (!inputValue || color.toLowerCase().includes(inputValue.toLowerCase())),
  )
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: itemsToAdd,
    inputValue,
    onInputValueChange: changes => {
      setInputValue(changes.inputValue)
    },
    onSelectedItemChange(changes) {
      if (changes.selectedItem) {
        addItem(changes.selectedItem)
      }
    },
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const {changes} = actionAndChanges

      if (changes.selectedItem) {
        return {...changes, inputValue: '', highlightedIndex: 0, isOpen: true}
      }

      return changes
    },
  })

  return (
    <div>
      <div
        {...getTagGroupProps({'aria-label': 'colors example'})}
        className="tag-group"
      >
        {items.map((color, index) => (
          <span
            className={`${index === activeIndex ? 'selected-tag' : ''} tag`}
            key={color}
            {...getTagProps({index, 'aria-label': color})}
          >
            {color}
            <button
              className="tag-remove-button"
              type="button"
              {...getTagRemoveProps({index, 'aria-label': 'remove'})}
            >
              &#10005;
            </button>
          </span>
        ))}
      </div>
      <div className="wrapper">
        <label {...getLabelProps()}>Choose your favorite book:</label>
        <div className="input-wrapper">
          <input
            placeholder="Best book ever"
            className="text-input"
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="toggle-button"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      <ul className="menu" {...getMenuProps()}>
        {isOpen
          ? itemsToAdd.map((item, index) => (
              <li
                className={`menu-item${index === highlightedIndex ? ' highlighted' : ''}`}
                key={item}
                {...getItemProps({item, index})}
              >
                <span>{item}</span>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
