import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate,
} from 'react-testing-library'
import Downshift from '../'
import {setIdCounter} from '../utils'

const oldError = console.error

beforeEach(() => {
  setIdCounter(1)
  console.error = jest.fn()
})

afterEach(() => {
  console.error = oldError
  cleanup()
})

test('clicking on a DOM node within an item selects that item', () => {
  // inspiration: https://github.com/paypal/downshift/issues/113
  const items = [{item: 'Chess'}, {item: 'Dominion'}, {item: 'Checkers'}]
  const {queryByTestId, renderSpy} = renderDownshift({items})
  const firstButton = queryByTestId('item-0-button')
  renderSpy.mockClear()
  Simulate.click(firstButton)
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      selectedItem: items[0].item,
    }),
  )
})

test('clicking anywhere within the rendered downshift but outside an item does not select an item', () => {
  const renderSpy = jest.fn(() => (
    <div>
      <button />
    </div>
  ))
  const {container} = render(<Downshift render={renderSpy} />)
  renderSpy.mockClear()
  Simulate.click(container.querySelector('button'))
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on mousemove of an item updates the highlightedIndex to that item', () => {
  const {queryByTestId, renderSpy} = renderDownshift()
  const thirdButton = queryByTestId('item-2-button')
  renderSpy.mockClear()
  Simulate.mouseMove(thirdButton)
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 2,
    }),
  )
})

test('on mousemove of the highlighted item should not emit changes', () => {
  const {queryByTestId, renderSpy} = renderDownshift({
    props: {defaultHighlightedIndex: 1},
  })
  const secondButton = queryByTestId('item-1-button')
  renderSpy.mockClear()
  Simulate.mouseMove(secondButton)
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on mousedown of the item should not change current focused element', () => {
  const renderSpy = jest.fn(({getItemProps}) => (
    <div>
      <button data-testid="external-button" />
      <div {...getItemProps({item: 'item-0'})}>
        <button data-testid="in-item-button" />
      </div>
    </div>
  ))
  const {queryByTestId} = render(<Downshift render={renderSpy} />)
  const externalButton = queryByTestId('external-button')
  const inItemButton = queryByTestId('in-item-button')
  renderSpy.mockClear()

  externalButton.focus()
  expect(document.activeElement).toBe(externalButton)
  Simulate.mouseDown(inItemButton)
  expect(document.activeElement).toBe(externalButton)
})

test('after selecting an item highlightedIndex should be reset to defaultHighlightIndex', () => {
  const {queryByTestId, renderSpy} = renderDownshift({
    props: {defaultHighlightedIndex: 1},
  })
  const firstButton = queryByTestId('item-0-button')
  renderSpy.mockClear()
  Simulate.click(firstButton)
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 1,
    }),
  )
})

test('getItemProps throws a helpful error when no object is given', () => {
  expect(() =>
    render(
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
    ).container.firstChild,
  ).toMatchSnapshot()
})

test('getItemProps throws when no item is given', () => {
  expect(() =>
    render(
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

test(`disabled item can't be selected by pressing enter`, () => {
  const items = [
    {item: 'Chess', disabled: true},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers', disabled: true},
  ]
  const utils = renderDownshift({items})
  const {input, arrowDownInput, enterOnInput, changeInputValue} = utils

  const firstItem = utils.queryByTestId('item-0')
  expect(firstItem.hasAttribute('disabled')).toBe(true)

  // input.simulate('keydown')
  changeInputValue('c')
  // ↓
  arrowDownInput()
  // ENTER to select the first one
  enterOnInput()
  // item was not selected -> input value should still be 'c'
  expect(input.value).toBe('c')
})

function renderDownshift({
  items = [{item: 'Chess'}, {item: 'Dominion'}, {item: 'Checkers'}],
  props,
} = {}) {
  const renderSpy = jest.fn(({getItemProps, getInputProps}) => (
    <div>
      <input {...getInputProps({'data-testid': 'input'})} />
      {items.map((item, index) => (
        <div
          {...getItemProps({
            ...item,
            index,
          })}
          key={index}
          data-testid={`item-${index}`}
        >
          <button data-testid={`item-${index}-button`}>{item.item}</button>
        </div>
      ))}
    </div>
  ))
  const utils = renderIntoDocument(
    <Downshift
      isOpen={true}
      onChange={() => {}}
      render={renderSpy}
      {...props}
    />,
  )
  const input = utils.queryByTestId('input')
  return {
    ...utils,
    renderSpy,
    input,
    arrowDownInput: extraEventProps =>
      Simulate.keyDown(input, {key: 'ArrowDown', ...extraEventProps}),
    arrowUpInput: extraEventProps =>
      Simulate.keyDown(input, {key: 'ArrowUp', ...extraEventProps}),
    escapeOnInput: extraEventProps =>
      Simulate.keyDown(input, {key: 'Escape', ...extraEventProps}),
    enterOnInput: extraEventProps =>
      Simulate.keyDown(input, {key: 'Enter', ...extraEventProps}),
    changeInputValue: (value, extraEventProps) =>
      Simulate.change(input, {target: {value}, ...extraEventProps}),
    blurOnInput: extraEventProps => Simulate.blur(input, extraEventProps),
  }
}

function setupWithDownshiftController() {
  let renderArg
  render(
    <Downshift
      render={controllerArg => {
        renderArg = controllerArg
        return null
      }}
    />,
  )
  return renderArg
}
