import * as React from 'react'

import {useTagGroup} from '..'

export const colors = [
  'Black',
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Orchid',
  'Aqua',
  'Lime',
  'Gray',
  'Brown',
  'Teal',
  'Skyblue',
]

const initialItems = colors.slice(0, 5)

export default function TagGroup() {
  const {
    addItem,
    getTagGroupProps,
    getTagProps,
    getTagRemoveProps,
    items,
    activeIndex,
  } = useTagGroup({initialItems})
  const itemsToAdd = colors.filter(color => !items.includes(color))
  const tagGroupRef = React.useRef<HTMLDivElement>(null)
  const tagRef = React.useRef<HTMLSpanElement>(null)

  return (
    <div>
      <div
        {...getTagGroupProps({
          'aria-label': 'colors example',
          ref: tagGroupRef,
        })}
      >
        {items.map((color, index) => (
          <span
            key={color}
            style={{fontWeight: index === activeIndex ? 'bold' : 'normal'}}
            {...getTagProps({
              index,
              'aria-label': color,
              ref: index === 0 ? tagRef : undefined,
            })}
          >
            {color}
            <li {...getTagRemoveProps({index, 'aria-label': 'remove'})}>
              &#10005;
            </li>
          </span>
        ))}
      </div>
      <div>Add more items:</div>
      <ul>
        {itemsToAdd.map(item => (
          <li key={item}>
            <button
              tabIndex={0}
              onClick={() => {
                addItem(item)
              }}
              onKeyDown={({key}) => {
                if (key === 'Enter') addItem(item)
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
