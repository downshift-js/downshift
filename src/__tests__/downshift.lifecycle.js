import React from 'react'
import {render, Simulate} from 'react-testing-library'
import Downshift from '../'
import setA11yStatus from '../set-a11y-status'
import * as utils from '../utils'

jest.useFakeTimers()
jest.mock('../set-a11y-status')

test('handles mouse events properly to reset state', () => {
  const handleStateChange = jest.fn()
  const renderSpy = jest.fn(({getInputProps}) => (
    <div>
      <input {...getInputProps({'data-testid': 'input'})} />
    </div>
  ))
  const MyComponent = () => (
    <Downshift onStateChange={handleStateChange} render={renderSpy} />
  )
  const {queryByTestId, container, unmount} = render(<MyComponent />)
  const input = queryByTestId('input')
  document.body.appendChild(container)

  // open the menu
  Simulate.keyDown(input, {key: 'ArrowDown'})
  handleStateChange.mockClear()

  // mouse down and up on within the autocomplete node
  mouseDownAndUp(input)
  expect(handleStateChange).toHaveBeenCalledTimes(0)

  // mouse down and up on outside the autocomplete node
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)

  renderSpy.mockClear()
  // does not call our state change handler when no state changes
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)
  // does not rerender when no state changes
  expect(renderSpy).not.toHaveBeenCalled()

  // cleans up
  unmount()
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)
})

test('handles state change for touchevent events', () => {
  const handleStateChange = jest.fn()
  const renderSpy = jest.fn(({getToggleButtonProps}) => (
    <button {...getToggleButtonProps({'data-testid': 'button'})} />
  ))

  const MyComponent = () => (
    <Downshift onStateChange={handleStateChange} render={renderSpy} />
  )
  const {queryByTestId, container, unmount} = render(<MyComponent />)
  document.body.appendChild(container)

  const button = queryByTestId('button')

  // touch outside for coverage
  document.body.dispatchEvent(
    new window.TouchEvent('touchstart', {bubbles: true}),
  )

  // open menu
  Simulate.click(button)
  jest.runAllTimers()

  expect(handleStateChange).toHaveBeenCalledTimes(1)

  // touch outside downshift
  document.body.dispatchEvent(
    new window.TouchEvent('touchstart', {bubbles: true}),
  )

  jest.runAllTimers()
  expect(handleStateChange).toHaveBeenCalledTimes(2)

  unmount()
})

test('props update causes the a11y status to be updated', () => {
  setA11yStatus.mockReset()
  const MyComponent = () => (
    <Downshift
      isOpen={false}
      render={({getInputProps, getItemProps, isOpen}) => (
        <div>
          <input {...getInputProps()} />
          {isOpen ? <div {...getItemProps({item: 'foo', index: 0})} /> : null}
        </div>
      )}
    />
  )
  const {container, unmount} = render(<MyComponent />)
  render(<MyComponent isOpen={true} />, {container})
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
  render(<MyComponent isOpen={false} />, {container})
  unmount()
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
})

test('inputValue initializes properly if the selectedItem is controlled and set', () => {
  const renderSpy = jest.fn(() => null)
  render(<Downshift selectedItem={'foo'} render={renderSpy} />)
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      inputValue: 'foo',
    }),
  )
})

test('props update of selectedItem will update the inputValue state', () => {
  const renderSpy = jest.fn(() => null)
  const {container} = render(
    <Downshift selectedItem={null} render={renderSpy} />,
  )
  renderSpy.mockClear()
  render(<Downshift selectedItem="foo" render={renderSpy} />, {container})
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      inputValue: 'foo',
    }),
  )
})

test('item selection when selectedItem is controlled will update the inputValue state after selectedItem prop has been updated', () => {
  const itemToString = jest.fn(x => x)
  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return <div />
  })
  const initialProps = {
    selectedItem: 'foo',
    itemToString,
    breakingChanges: {resetInputOnSelection: false},
    // Explicitly set to false even if this is the default behaviour to highlight that this test
    // will fail on v2.
    render: renderSpy,
  }
  const {container} = render(<Downshift {...initialProps} />)
  renderSpy.mockClear()
  itemToString.mockClear()
  const newSelectedItem = 'newfoo'
  renderArg.selectItem(newSelectedItem)
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({inputValue: newSelectedItem}),
  )
  render(<Downshift {...initialProps} selectedItem={newSelectedItem} />, {
    container,
  })
  expect(itemToString).toHaveBeenCalledTimes(2)
  expect(itemToString).toHaveBeenCalledWith(newSelectedItem)
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({inputValue: newSelectedItem}),
  )
})

test('v2 BREAKING CHANGE item selection when selectedItem is controlled will update the inputValue state after selectedItem prop has been updated', () => {
  const itemToString = jest.fn(x => x)
  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return <div />
  })
  const initialProps = {
    selectedItem: 'foo',
    itemToString,
    breakingChanges: {resetInputOnSelection: true},
    render: renderSpy,
  }
  const {container} = render(<Downshift {...initialProps} />)
  renderSpy.mockClear()
  itemToString.mockClear()
  const newSelectedItem = 'newfoo'
  renderArg.selectItem(newSelectedItem)
  expect(renderSpy).not.toHaveBeenLastCalledWith(
    expect.objectContaining({inputValue: newSelectedItem}),
  )
  render(<Downshift {...initialProps} selectedItem={newSelectedItem} />, {
    container,
  })
  expect(itemToString).toHaveBeenCalledTimes(1)
  expect(itemToString).toHaveBeenCalledWith(newSelectedItem)
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({inputValue: newSelectedItem}),
  )
})

test('the callback is invoked on selected item only if it is a function', () => {
  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return <div />
  })
  const callbackSpy = jest.fn(x => x)
  render(<Downshift selectedItem="foo" render={renderSpy} />)

  renderSpy.mockClear()
  callbackSpy.mockClear()
  renderArg.selectItem('foo', {}, callbackSpy)
  expect(callbackSpy).toHaveBeenCalledTimes(1)
  renderArg.selectItem('foo', {}, {})
})

test('props update of selectedItem will not update inputValue state', () => {
  const onInputValueChangeSpy = jest.fn(() => null)
  const initialProps = {
    onInputValueChange: onInputValueChangeSpy,
    selectedItemChanged: (prevItem, item) => prevItem.id !== item.id,
    selectedItem: {id: '123', value: 'wow'},
    itemToString: i => (i ? i.value : ''),
    render: () => null,
  }
  const {container} = render(<Downshift {...initialProps} />)
  onInputValueChangeSpy.mockClear()
  render(
    <Downshift
      {...initialProps}
      selectedItem={{id: '123', value: 'not wow'}}
    />,
    {container},
  )
  expect(onInputValueChangeSpy).not.toHaveBeenCalled()
})

test('controlled highlighted index change scrolls the item into view', () => {
  // sadly, testing scroll is really difficult in a jsdom environment.
  // Perhaps eventually we'll add real integration tests with cypress
  // or something, but for now we'll just mock the implementation of
  // utils.scrollIntoView and ensure it's called with the proper arguments
  // assuming that the test suite for utils.scrollIntoView will ensure
  // this functionality doesn't break.
  jest.spyOn(utils, 'scrollIntoView').mockImplementation(() => {})
  const oneHundredItems = Array.from({length: 100})
  const renderFn = jest.fn(({getItemProps}) => (
    <div data-testid="root">
      {oneHundredItems.map((x, i) => (
        <div key={i} {...getItemProps({item: i})} data-testid={`item-${i}`} />
      ))}
    </div>
  ))
  const {container, updateProps, queryByTestId} = setup({
    highlightedIndex: 1,
    render: renderFn,
  })
  document.body.appendChild(container)
  renderFn.mockClear()
  updateProps({highlightedIndex: 75})
  expect(renderFn).toHaveBeenCalledTimes(1)

  expect(utils.scrollIntoView).toHaveBeenCalledTimes(1)
  const rootDiv = queryByTestId('root')
  expect(utils.scrollIntoView).toHaveBeenCalledWith(
    queryByTestId('item-75'),
    rootDiv,
  )

  utils.scrollIntoView.mockRestore()
})

function mouseDownAndUp(node) {
  node.dispatchEvent(new window.MouseEvent('mousedown', {bubbles: true}))
  node.dispatchEvent(new window.MouseEvent('mouseup', {bubbles: true}))
}

function setup({render: renderFn = () => <div />, ...props} = {}) {
  // eslint-disable-next-line prefer-const
  let container, renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return renderFn(controllerArg)
  })
  const updateProps = newProps => {
    return render(<Downshift render={renderSpy} {...props} {...newProps} />, {
      container,
    })
  }
  const renderUtils = updateProps()
  container = renderUtils.container
  return {
    renderSpy,
    updateProps,
    ...renderUtils,
    ...renderArg,
  }
}
