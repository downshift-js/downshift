import React from 'react'
import {mount, render} from 'enzyme'
import Downshift from '../'
import {setIdCounter} from '../utils'

const oldError = console.error

beforeEach(() => {
  setIdCounter(1)
  console.error = jest.fn()
})

afterEach(() => {
  console.error = oldError
})

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
  const childSpy = jest.fn(() => (
    <div>
      <button />
    </div>
  ))
  const wrapper = mount(<Downshift>{childSpy}</Downshift>)
  childSpy.mockClear()
  wrapper
    .find('button')
    .first()
    .simulate('click')
  expect(childSpy).not.toHaveBeenCalled()
})

test('on mouseenter of an item updates the highlightedIndex to that item', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const thirdButton = wrapper.find('[data-test="item-2"]')
  childSpy.mockClear()
  thirdButton.simulate('mouseenter')
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 2,
    }),
  )
})

test('after selecting an item highlightedIndex should be reset to defaultHighlightIndex', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component defaultHighlightedIndex={1} />)
  const firstButton = wrapper.find('button').first()
  childSpy.mockClear()
  firstButton.simulate('click')
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 1,
    }),
  )
})

test('getItemProps throws a helpful error when no object is given', () => {
  expect(() =>
    mount(
      <Downshift>
        {({getItemProps}) => (
          <div>
            <span {...getItemProps()} />
          </div>
        )}
      </Downshift>,
    ),
  ).toThrowErrorMatchingSnapshot()
})

test('getItemProps defaults the index when no index is given', () => {
  expect(
    render(
      <Downshift>
        {({getItemProps}) => (
          <div>
            <span {...getItemProps({item: 0})}>0</span>
            <span {...getItemProps({item: 1})}>1</span>
            <span {...getItemProps({item: 2})}>2</span>
            <span {...getItemProps({item: 3})}>3</span>
            <span {...getItemProps({item: 4})}>4</span>
          </div>
        )}
      </Downshift>,
    ),
  ).toMatchSnapshot()
})

test('getItemProps throws when no item is given', () => {
  expect(() =>
    mount(
      <Downshift>
        {({getItemProps}) => (
          <div>
            <span {...getItemProps({index: 0})} />
          </div>
        )}
      </Downshift>,
    ),
  ).toThrowErrorMatchingSnapshot()
})

function setup({items = ['Chess', 'Dominion', 'Checkers']} = {}) {
  const childSpy = jest.fn(({getItemProps}) => (
    <div>
      {items.map((item, index) => (
        <div
          {...getItemProps({item, index})}
          key={index}
          data-test={`item-${index}`}
        >
          <button>{item}</button>
        </div>
      ))}
    </div>
  ))
  function BasicDownshift(props) {
    return (
      <Downshift isOpen={true} onChange={() => {}} {...props}>
        {childSpy}
      </Downshift>
    )
  }
  return {Component: BasicDownshift, childSpy}
}

/* eslint no-console:0 */
