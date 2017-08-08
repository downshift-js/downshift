import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

const colors = [
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Palevioletred',
  'Rebeccapurple',
  'Navy Blue',
]

test('clicking on a DOM node within an item selects that item', () => {
  // inspiration: https://github.com/paypal/downshift/issues/113
  const items = ['Chess', 'Dominion', 'Checkers']
  const {Component, childSpy} = setup({
    items,
    itemMap(getItemProps, item, index) {
      return (
        <div {...getItemProps({item, index, key: index})}>
          <button>
            {item}
          </button>
        </div>
      )
    },
  })
  const wrapper = mount(<Component />)
  const firstButton = wrapper.find('button').first()
  childSpy.mockClear()
  firstButton.simulate('click')
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      selectedItem: items[0],
    }),
  )
})

function setup(
  {
    items = colors,
    itemMap = (getItemProps, item, index) =>
      (<div key={item} {...getItemProps({item, index})}>
        {item}
      </div>),
  } = {},
) {
  const childSpy = jest.fn(({getItemProps}) =>
    (<div>
      {items.map((item, index) => itemMap(getItemProps, item, index))}
    </div>),
  )
  function BasicDownshift(props) {
    return (
      <Downshift isOpen={true} onChange={() => {}} {...props}>
        {childSpy}
      </Downshift>
    )
  }
  return {Component: BasicDownshift, childSpy}
}
