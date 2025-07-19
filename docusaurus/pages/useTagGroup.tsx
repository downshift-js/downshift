import * as React from 'react'

import {useTagGroup} from '../../src'
import {colors} from '../utils'

import './useTagGroup.css'

export default function TagGroup() {
  const initialItems = colors.slice(0, 5)
  const {
    addItem,
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
          <li key={item}>
            <button
              className="item-to-add"
              tabIndex={0}
              onClick={() => {
                addItem(item)
              }}
              onKeyDown={({key}) => {
                key === 'Enter' && addItem(item)
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
