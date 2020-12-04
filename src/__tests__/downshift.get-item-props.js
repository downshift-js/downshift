import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Downshift from '../'
import {setIdCounter} from '../utils'

beforeEach(() => {
  setIdCounter(1)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => console.error.mockRestore())

test('clicking on a DOM node within an item selects that item', () => {
  // inspiration: https://github.com/downshift-js/downshift/issues/113
  const items = [{item: 'Chess'}, {item: 'Dominion'}, {item: 'Checkers'}]
  const {childrenSpy} = renderDownshift({items})
  const firstButton = screen.queryByTestId('item-0-button')
  childrenSpy.mockClear()
  fireEvent.click(firstButton)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      selectedItem: items[0].item,
    }),
  )
})

test('clicking anywhere within the rendered downshift but outside an item does not select an item', () => {
  const childrenSpy = jest.fn(() => (
    <div>
      <button />
    </div>
  ))
  const {container} = render(<Downshift>{childrenSpy}</Downshift>)
  childrenSpy.mockClear()
  fireEvent.click(container.querySelector('button'))
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('on mousemove of an item updates the highlightedIndex to that item', () => {
  const {childrenSpy} = renderDownshift()
  const thirdButton = screen.queryByTestId('item-2-button')
  childrenSpy.mockClear()
  fireEvent.mouseMove(thirdButton)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 2,
    }),
  )
})

test('on mousemove of the highlighted item should not emit changes', () => {
  const {childrenSpy} = renderDownshift({
    props: {defaultHighlightedIndex: 1},
  })
  const secondButton = screen.queryByTestId('item-1-button')
  childrenSpy.mockClear()
  fireEvent.mouseMove(secondButton)
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('on mousedown of the item should not change current focused element', () => {
  const childrenSpy = jest.fn(({getItemProps}) => (
    <div>
      <button data-testid="external-button" />
      <div {...getItemProps({item: 'item-0'})}>
        <button data-testid="in-item-button" />
      </div>
    </div>
  ))
  render(<Downshift>{childrenSpy}</Downshift>)
  const externalButton = screen.queryByTestId('external-button')
  const inItemButton = screen.queryByTestId('in-item-button')
  childrenSpy.mockClear()

  externalButton.focus()
  expect(externalButton).toHaveFocus()
  fireEvent.mouseDown(inItemButton)
  expect(externalButton).toHaveFocus()
})

test('after selecting an item highlightedIndex should be reset to defaultHighlightIndex', () => {
  const {childrenSpy} = renderDownshift({
    props: {defaultHighlightedIndex: 1},
  })
  const firstButton = screen.queryByTestId('item-0-button')
  childrenSpy.mockClear()
  fireEvent.click(firstButton)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: 1,
    }),
  )
})

test('getItemProps logs a helpful error when no object is given', () => {
  render(
    <Downshift>
      {({getItemProps}) => (
        <div>
          <span {...getItemProps()} />
        </div>
      )}
    </Downshift>,
  )
  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
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
    ).container.firstChild,
  ).toMatchSnapshot()
})

test('getItemProps logs error when no item is given', () => {
  render(
    <Downshift>
      {({getItemProps}) => (
        <div>
          <span {...getItemProps({index: 0})} />
        </div>
      )}
    </Downshift>,
  )

  expect(console.error.mock.calls[0][0]).toMatchSnapshot()
})

// normally this test would be like the others where we render and then simulate a click on an
// item to ensure that a disabled item cannot be clicked, however this is only a problem in IE11
// so we have to get into the implementation details a little bit (unless we want to run these tests
// in IE11... no thank you 🙅)
test(`getItemProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getItemProps} = setupWithDownshiftController()
  const props = getItemProps({item: 'dog', disabled: true})
  const entry = Object.entries(props).find(
    ([key, value]) => key !== 'onMouseDown' && typeof value === 'function',
  )
  // eslint-disable-next-line jest/no-if
  if (entry) {
    throw new Error(
      `getItemProps should not have any props that are callbacks. It has ${entry[0]}.`,
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

  const firstItem = screen.queryByTestId('item-0')
  // eslint-disable-next-line jest-dom/prefer-enabled-disabled
  expect(firstItem).toHaveAttribute('disabled')

  changeInputValue('c')
  // ↓
  arrowDownInput()
  // ENTER to select the first one
  enterOnInput()
  // item was not selected -> input value should still be 'c'
  expect(input).toHaveValue('c')
})

test(`disabled item can't be highlighted when navigating via keyDown`, () => {
  const items = [
    {item: 'Chess'},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers'},
    {item: 'Backgammon'},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 0}})
  const {input, arrowDownInput, enterOnInput} = utils

  // ↓
  arrowDownInput()
  // ↓ (should skip the first and second option)
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Checkers')
})

test(`disabled item can't be highlighted and may wrap when navigating via keyDown`, () => {
  const items = [
    {item: 'Chess'},
    {item: 'Dominion'},
    {item: 'Checkers', disabled: true},
    {item: 'Backgammon', disabled: true},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 1}})
  const {input, arrowDownInput, enterOnInput} = utils

  // ↓
  arrowDownInput()
  // ↓ (should skip the first and second option)
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Chess')
})

test(`disabled item can't be highlighted when navigating via keyUp`, () => {
  const items = [
    {item: 'Chess'},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers'},
    {item: 'Backgammon'},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 2}})
  const {input, arrowUpInput, enterOnInput} = utils

  // ↑
  arrowUpInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Chess')
})

test(`disabled item can't be highlighted and it may wrap when navigating via keyUp`, () => {
  const items = [
    {item: 'Chess', disabled: true},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers'},
    {item: 'Backgammon'},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 2}})
  const {input, arrowUpInput, enterOnInput} = utils

  // ↑
  arrowUpInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Backgammon')
})

test(`disabled item can't be highlighted when navigating via end`, () => {
  const items = [
    {item: 'Backgammon'},
    {item: 'Chess'},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers', disabled: true},
  ]
  const utils = renderDownshift({items})
  const {input, endOnInput, enterOnInput} = utils

  // end
  endOnInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Chess')
})

test(`disabled item can't be highlighted when navigating via home`, () => {
  const items = [
    {item: 'Chess', disabled: true},
    {item: 'Dominion', disabled: true},
    {item: 'Checkers'},
    {item: 'Backgammon'},
  ]
  const utils = renderDownshift({items})
  const {input, homeOnInput, enterOnInput} = utils

  // home
  homeOnInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Checkers')
})

test(`highlight wrapping works with disabled items upwards`, () => {
  const items = [
    {item: 'Chess', disabled: true},
    {item: 'Dominion'},
    {item: 'Checkers'},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 1}})
  const {input, arrowUpInput, enterOnInput} = utils

  // ↑
  arrowUpInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Checkers')
})

test(`highlight wrapping works with disabled items downwards`, () => {
  const items = [
    {item: 'Chess'},
    {item: 'Dominion'},
    {item: 'Checkers', disabled: true},
  ]
  const utils = renderDownshift({items, props: {initialHighlightedIndex: 1}})
  const {input, arrowDownInput, enterOnInput} = utils

  // ↓
  arrowDownInput()
  // ENTER to select
  enterOnInput()

  expect(input).toHaveValue('Chess')
})

function renderDownshift({
  items = [{item: 'Chess'}, {item: 'Dominion'}, {item: 'Checkers'}],
  props,
} = {}) {
  const childrenSpy = jest.fn(({getItemProps, getInputProps}) => (
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
  const utils = render(
    <Downshift
      isOpen={true}
      onChange={() => {}}
      children={childrenSpy}
      {...props}
    />,
  )
  const input = screen.queryByTestId('input')
  return {
    ...utils,
    childrenSpy,
    input,
    homeOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'Home', ...extraEventProps}),
    endOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'End', ...extraEventProps}),
    arrowDownInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'ArrowDown', ...extraEventProps}),
    arrowUpInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'ArrowUp', ...extraEventProps}),
    enterOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'Enter', ...extraEventProps}),
    changeInputValue: (value, extraEventProps) => {
      fireEvent.change(input, {target: {value}, ...extraEventProps})
    },
  }
}

function setupWithDownshiftController() {
  let renderArg
  render(
    <Downshift>
      {controllerArg => {
        renderArg = controllerArg
        return null
      }}
    </Downshift>,
  )
  return renderArg
}
