import * as React from 'react'
import {render, renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {UseTagGroupProps} from './index.types'
import useTagGroup from '.'

export * from '@testing-library/react'

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

const colors = [
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

export const defaultProps = {
  initialItems: colors.slice(0, 5),
}

export const defaultIds = {
  tagGroupId: 'downshift-test-id-tag-group',
  getTagId: (index: number) => `downshift-test-id-tag-${index}`,
}

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

  return {...utils, getTags, getTagGroup, clickOnTag, clickOnRemoveTag, user}
}

export function renderUseTagGroup(
  initialProps: Partial<UseTagGroupProps<string>> = {},
) {
  return renderHook(
    (props: Partial<UseTagGroupProps<string>> = {}) => useTagGroup(props),
    {initialProps: {...defaultProps, ...initialProps}},
  )
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
