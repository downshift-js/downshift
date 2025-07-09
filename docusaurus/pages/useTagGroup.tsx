import * as React from 'react'

import {useTagGroup} from '../../src'

import {
  colors,
  removeTagStyles,
  selectedItemsContainerSyles,
  selectedItemStyles,
} from '../utils'

export default function DropdownMultipleCombobox() {
  const {getTagProps, getTagRemoveProps, getTagGroupProps} = useTagGroup()

  return (
    <div {...getTagGroupProps()} style={selectedItemsContainerSyles}>
      {colors.map((color, index) => (
        <span style={selectedItemStyles} key={color} {...getTagProps({index})}>
          {color}
          <span
            style={removeTagStyles}
            {...getTagRemoveProps({index, 'aria-label': 'Remove color.'})}
          >
            &#10005;
          </span>
        </span>
      ))}
    </div>
  )
}
