/* eslint-disable testing-library/prefer-screen-queries */
import * as React from 'react'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useTagGroup from '../..'
import {UseTagGroupProps} from '../../index.types'
import {defaultProps} from './defaultProps'

export function renderTagGroup(props: Partial<UseTagGroupProps<string>> = {}) {
  const utils = render(<TagGroup {...defaultProps} {...props} />)
  const user = userEvent.setup()

  function getTags() {
    return utils.getAllByRole('row')
  }

  function getTagGroup() {
    return utils.getByRole('grid')
  }

  function getTagsRemoves() {
    return utils.getAllByRole('button')
  }

  async function clickOnTag(index: number) {
    const tags = getTags()
    const tag = tags[index] as HTMLElement

    await user.click(tag)
  }

  async function clickOnRemoveTag(index: number) {
    const removeButtons = getTagsRemoves()

    await user.click(removeButtons[index] as HTMLElement)
  }

  return {
    ...utils,
    getTags,
    getTagGroup,
    clickOnTag,
    clickOnRemoveTag,
    getTagsRemoves,
    user,
  }
}

function TagGroup(props: Partial<UseTagGroupProps<string>> = {}) {
  const {getTagProps, getTagRemoveProps, getTagGroupProps, items, activeIndex} =
    useTagGroup(props)

  return (
    <div {...getTagGroupProps()} className="tag-group">
      {items.map((color, index) => (
        <span
          className={`${index === activeIndex ? 'selected-tag' : ''} tag`}
          key={color}
          aria-label={color}
          {...getTagProps({index})}
        >
          {color}
          <button
            className="tag-remove-button"
            {...getTagRemoveProps({index, 'aria-label': 'remove color'})}
          >
            &#10005;
          </button>
        </span>
      ))}
    </div>
  )
}
