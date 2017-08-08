import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('clicking on a DOM node within an item selects that item', () => {
  // inspiration: https://github.com/paypal/downshift/issues/113
  const items = ['Chess', 'Dominion', 'Checkers']
  const {Component, childSpy} = setup({items})
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

test('clicking anywhere within the rendered downshift but outside an item does not select an item', () => {
  const childSpy = jest.fn(() =>
    (<div>
      <button />
    </div>),
  )
  const wrapper = mount(
    <Downshift>
      {childSpy}
    </Downshift>,
  )
  childSpy.mockClear()
  wrapper.find('button').first().simulate('click')
  expect(childSpy).toHaveBeenCalledTimes(0)
})

test('on mouseenter of an item updates the highlightedIndex to that item', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const thirdButton = wrapper.find('button').at(2)
  childSpy.mockClear()
  thirdButton.parent().simulate('mouseenter')
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 2,
    }),
  )
})

test('does not error when given no props', () => {
  expect(() =>
    mount(
      <Downshift>
        {({getItemProps}) =>
          (<div>
            <span {...getItemProps()} />
          </div>)}
      </Downshift>,
    ),
  ).not.toThrow()
})

function setup({items = ['Chess', 'Dominion', 'Checkers']} = {}) {
  const childSpy = jest.fn(({getItemProps}) =>
    (<div>
      {items.map((item, index) =>
        (<div {...getItemProps({item, index})} key={index}>
          <button>
            {item}
          </button>
        </div>),
      )}
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
