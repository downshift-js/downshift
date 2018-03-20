import React from 'react'
import {render, Simulate} from 'react-testing-library'
import Downshift from '../'

jest.useFakeTimers()

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

test('manages arrow up and down behavior', () => {
  const {arrowUpInput, arrowDownInput, renderSpy} = renderDownshift()
  // ↓
  arrowDownInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↓
  arrowDownInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↓
  arrowDownInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 1}),
  )

  // <Shift>↓
  arrowDownInput({shiftKey: true})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 6}),
  )

  // ↑
  arrowUpInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 5}),
  )

  // <Shift>↑
  arrowUpInput({shiftKey: true})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↑
  arrowUpInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )

  // ↓
  arrowDownInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
})

test('arrow key down events do nothing when no items are rendered', () => {
  const {arrowDownInput, renderSpy} = renderDownshift({items: []})
  // ↓↓
  arrowDownInput()
  arrowDownInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: null}),
  )
})

test('arrow up on a closed menu opens the menu', () => {
  const {arrowUpInput, renderSpy} = renderDownshift()
  // ↑
  arrowUpInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↑
  arrowUpInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )
})

test('enter on an input with a closed menu does nothing', () => {
  const {enterOnInput, renderSpy} = renderDownshift()
  renderSpy.mockClear()
  // ENTER
  enterOnInput()
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu does nothing without a highlightedIndex', () => {
  const {enterOnInput, renderSpy} = renderDownshift({props: {isOpen: true}})
  renderSpy.mockClear()
  // ENTER
  enterOnInput()
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu and a highlightedIndex selects that item', () => {
  const onChange = jest.fn()
  const isOpen = true
  const {arrowDownInput, enterOnInput, renderSpy} = renderDownshift({
    props: {isOpen, onChange},
  })
  // ↓
  arrowDownInput()
  // ENTER
  enterOnInput()
  expect(onChange).toHaveBeenCalledTimes(1)
  const newState = expect.objectContaining({
    selectedItem: colors[0],
    isOpen,
    highlightedIndex: null,
    inputValue: colors[0],
  })
  expect(onChange).toHaveBeenCalledWith(colors[0], newState)
  expect(renderSpy).toHaveBeenLastCalledWith(newState)
})

test('escape on an input without a selection should reset downshift and close the menu', () => {
  const {changeInputValue, input, escapeOnInput, renderSpy} = renderDownshift()
  changeInputValue('p')
  escapeOnInput()
  expect(input.value).toBe('')
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: '',
    }),
  )
})

test('escape on an input with a selection should reset downshift and close the menu', () => {
  const {escapeOnInput, renderSpy, items} = setupDownshiftWithState()
  escapeOnInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur resets the state', () => {
  const {blurOnInput, renderSpy, items} = setupDownshiftWithState()
  blurOnInput()
  jest.runAllTimers()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur does not reset the state when the mouse is down', () => {
  const {blurOnInput, renderSpy} = setupDownshiftWithState()
  // mousedown somwhere
  document.body.dispatchEvent(
    new window.MouseEvent('mousedown', {bubbles: true}),
  )
  blurOnInput()
  jest.runAllTimers()
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on input blur does not reset the state when new focus is on downshift button', () => {
  const {blurOnInput, renderSpy, button} = setupDownshiftWithState()
  blurOnInput()
  button.focus()
  jest.runAllTimers()
  expect(renderSpy).not.toHaveBeenCalled()
})

test('keydown of things that are not handled do nothing', () => {
  const modifiers = [undefined, 'Shift']
  const {input, renderSpy} = renderDownshift()
  renderSpy.mockClear()
  modifiers.forEach(key => {
    Simulate.keyDown(input, {key})
  })
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('highlightedIndex uses the given itemCount prop to determine the last index', () => {
  const itemCount = 200
  const {arrowUpInput, renderSpy} = renderDownshift({
    props: {itemCount, isOpen: true},
  })
  // ↑
  arrowUpInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: itemCount - 1}),
  )
})

test('itemCount can be set and unset asynchronously', () => {
  let downshift
  const renderSpy = jest.fn(d => {
    downshift = d
    return (
      <div>
        <input {...d.getInputProps({'data-testid': 'input'})} />
      </div>
    )
  })
  const {queryByTestId} = render(
    <Downshift isOpen={true} render={renderSpy} itemCount={10} />,
  )
  const input = queryByTestId('input')
  const up = () => Simulate.keyDown(input, {key: 'ArrowUp'})
  const down = () => Simulate.keyDown(input, {key: 'ArrowDown'})

  downshift.setItemCount(100)
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 99}),
  )
  down()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.setItemCount(40)
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 39}),
  )
  down()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.unsetItemCount()
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 9}),
  )
})

test('Enter when there is no item at index 0 still selects the highlighted item', () => {
  // test inspired by https://github.com/paypal/downshift/issues/119
  // use case is virtualized lists
  const items = [
    {value: 'cat', index: 1},
    {value: 'dog', index: 2},
    {value: 'bird', index: 3},
    {value: 'cheetah', index: 4},
  ]
  const {arrowDownInput, enterOnInput, renderSpy} = renderDownshift({
    items,
    props: {
      itemToString: i => (i ? i.value : ''),
      defaultHighlightedIndex: 1,
      isOpen: true,
    },
  })

  // ↓
  arrowDownInput()
  // ENTER
  renderSpy.mockClear()
  enterOnInput()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedItem: items[1],
    }),
  )
})

// normally this test would be like the others where we render and then simulate a click on the
// button to ensure that a disabled input cannot be interacted with, however this is only a problem in IE11
// so we have to get into the implementation details a little bit (unless we want to run these tests
// in IE11... no thank you 🙅)
test(`getInputProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getInputProps} = setupWithDownshiftController()
  const props = getInputProps({disabled: true})
  const entry = Object.entries(props).find(
    ([_key, value]) => typeof value === 'function',
  )
  if (entry) {
    throw new Error(
      `getInputProps should not have any props that are callbacks. It has ${
        entry[0]
      }.`,
    )
  }
})

function setupDownshiftWithState() {
  const items = ['animal', 'bug', 'cat']
  const utils = renderDownshift({items})
  const {
    input,
    changeInputValue,
    arrowDownInput,
    enterOnInput,
    renderSpy,
  } = utils
  // input.simulate('keydown')
  changeInputValue('a')
  // ↓
  arrowDownInput()
  // ENTER to select the first one
  enterOnInput()
  expect(input.value).toBe(items[0])
  // ↓
  arrowDownInput()
  changeInputValue('bu')
  renderSpy.mockClear()
  return {renderSpy, items, ...utils}
}

function setup({items = colors} = {}) {
  /* eslint-disable react/jsx-closing-bracket-location */
  const renderSpy = jest.fn(
    ({isOpen, getInputProps, getButtonProps, getItemProps}) => (
      <div>
        <input {...getInputProps({'data-testid': 'input'})} />
        <button {...getButtonProps({'data-testid': 'button'})} />
        {isOpen && (
          <div>
            {items.map((item, index) => (
              <div
                key={item.index || index}
                {...getItemProps({item, index: item.index || index})}
              >
                {item.value ? item.value : item}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  )

  function BasicDownshift(props) {
    return <Downshift {...props} render={renderSpy} />
  }
  return {
    Component: BasicDownshift,
    renderSpy,
  }
}

function renderDownshift({items, props} = {}) {
  const {Component, renderSpy} = setup({items})
  const utils = render(<Component {...props} />)
  const input = utils.queryByTestId('input')
  return {
    Component,
    renderSpy,
    ...utils,
    input,
    button: utils.queryByTestId('button'),
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
