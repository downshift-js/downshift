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
  const {Component, renderSpy} = setup({items})
  const wrapper = mount(<Component />)
  const firstButton = wrapper.find('button').first()
  renderSpy.mockClear()
  firstButton.simulate('click')
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      selectedItem: items[0],
    }),
  )
})

test('clicking anywhere within the rendered downshift but outside an item does not select an item', () => {
  const renderSpy = jest.fn(() => (
    <div>
      <button />
    </div>
  ))
  const wrapper = mount(<Downshift render={renderSpy} />)
  renderSpy.mockClear()
  wrapper
    .find('button')
    .first()
    .simulate('click')
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on mousemove of an item updates the highlightedIndex to that item', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const thirdButton = wrapper.find('[data-test="item-2"]')
  renderSpy.mockClear()
  thirdButton.simulate('mousemove')
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 2,
    }),
  )
})

test('on mousemove of the highlighted item should not emit changes', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component defaultHighlightedIndex={1} />)
  const secondButton = wrapper.find('[data-test="item-1"]')
  renderSpy.mockClear()
  secondButton.simulate('mousemove')
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on mousedown of the item should not change current focused element', () => {
  const renderSpy = jest.fn(({getItemProps}) => (
    <div>
      <button id="external-button" />
      <div {...getItemProps({item: 'item-0'})}>
        <button id="in-item-button" />
      </div>
    </div>
  ))
  const wrapper = mount(<Downshift render={renderSpy} />)
  const externalButton = wrapper.find('button[id="external-button"]').first()
  const externalButtonNode = externalButton.getDOMNode()
  const inItemButton = wrapper.find('button[id="in-item-button"]').first()
  renderSpy.mockClear()

  externalButtonNode.focus()
  expect(document.activeElement).toBe(externalButtonNode)
  inItemButton.simulate('mousedown')
  expect(document.activeElement).toBe(externalButtonNode)
})

test('after selecting an item highlightedIndex should be reset to defaultHighlightIndex', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component defaultHighlightedIndex={1} />)
  const firstButton = wrapper.find('button').first()
  renderSpy.mockClear()
  firstButton.simulate('click')
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 1,
    }),
  )
})

test('getItemProps throws a helpful error when no object is given', () => {
  expect(() =>
    mount(
      <Downshift
        render={({getItemProps}) => (
          <div>
            <span {...getItemProps()} />
          </div>
        )}
      />,
    ),
  ).toThrowErrorMatchingSnapshot()
})

test('getItemProps defaults the index when no index is given', () => {
  expect(
    render(
      <Downshift
        render={({getItemProps}) => (
          <div>
            <span {...getItemProps({item: 0})}>0</span>
            <span {...getItemProps({item: 1})}>1</span>
            <span {...getItemProps({item: 2})}>2</span>
            <span {...getItemProps({item: 3})}>3</span>
            <span {...getItemProps({item: 4})}>4</span>
          </div>
        )}
      />,
    ),
  ).toMatchSnapshot()
})

test('getItemProps throws when no item is given', () => {
  expect(() =>
    mount(
      <Downshift
        render={({getItemProps}) => (
          <div>
            <span {...getItemProps({index: 0})} />
          </div>
        )}
      />,
    ),
  ).toThrowErrorMatchingSnapshot()
})

// normally this test would be like the others where we render and then simulate a click on an
// item to ensure that a disabled item cannot be clicked, however this is only a problem in IE11
// so we have to get into the implementation details a little bit (unless we want to run these tests
// in IE11... no thank you 🙅)
test(`getItemProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getItemProps} = setupWithDownshiftController()
  const props = getItemProps({item: 'dog', disabled: true})
  const entry = Object.entries(props).find(
    ([_key, value]) => typeof value === 'function',
  )
  if (entry) {
    throw new Error(
      `getItemProps should not have any props that are callbacks. It has ${
        entry[0]
      }.`,
    )
  }
})

function setup({items = ['Chess', 'Dominion', 'Checkers']} = {}) {
  const renderSpy = jest.fn(({getItemProps}) => (
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
      <Downshift
        isOpen={true}
        onChange={() => {}}
        {...props}
        render={renderSpy}
      />
    )
  }
  return {Component: BasicDownshift, renderSpy}
}

function setupWithDownshiftController() {
  let renderArg
  mount(
    <Downshift
      render={controllerArg => {
        renderArg = controllerArg
        return null
      }}
    />,
  )
  return renderArg
}

/* eslint no-console:0 */
