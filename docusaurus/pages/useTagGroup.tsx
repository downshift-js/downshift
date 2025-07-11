import * as React from 'react'

import {useTagGroup} from '../../src'
import {colors} from '../utils'

import './useTagGroup.css'

export default function DropdownMultipleCombobox() {
  const initialItems = colors.slice(0, 5)
  const {
    getTagProps,
    getTagRemoveProps,
    getTagGroupProps,
    items,
    activeIndex,
  } = useTagGroup({initialItems})
  const itemsToAdd = colors.filter(color => !items.includes(color))

  return (
    <div>
      <div {...getTagGroupProps()} className="tag-group">
        {items.map((color, index) => (
          <span
            className={`${index === activeIndex ? 'selected-tag' : ''} tag`}
            key={color}
            {...getTagProps({index})}
          >
            {color}
            <span
              className="tag-remove-button"
              {...getTagRemoveProps({index, 'aria-label': 'remove color'})}
            >
              &#10005;
            </span>
          </span>
        ))}
      </div>
      <div>Add more items:</div>
      <ul>
        {itemsToAdd.map(item => (
          <li className="item-to-add" tabIndex={0} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
