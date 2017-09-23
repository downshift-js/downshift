// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */
/*
eslint-disable
react/prop-types,
no-console,
react/display-name,
import/extensions,
import/no-unresolved
*/

/*
Testing the preact version is a tiny bit complicated because
we need the preact build (the one that imports 'preact' rather
than 'react') otherwise things don't work very well.
So there's a script `test.build` which will run the cjs build
for preact before running this test.
 */

import preact from 'preact'
import render from 'preact-render-to-string'
import Downshift from '../../preact'

test('works with preact', () => {
  const childSpy = jest.fn(({getInputProps, getItemProps}) => (
    <div>
      <input {...getInputProps()} />
      <div>
        <div {...getItemProps({item: 'foo', index: 0})}>foo</div>
        <div {...getItemProps({item: 'bar', index: 1})}>bar</div>
      </div>
    </div>
  ))
  const ui = <Downshift>{childSpy}</Downshift>
  render(ui)
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
      highlightedIndex: null,
      selectedItem: null,
      inputValue: '',
    }),
  )
})

test('can render a composite component', () => {
  const Div = ({innerRef, ...props}) => <div {...props} ref={innerRef} />
  const childSpy = jest.fn(({getRootProps}) => (
    <Div {...getRootProps({refKey: 'innerRef'})} />
  ))
  const ui = <Downshift>{childSpy}</Downshift>
  render(ui)
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
      highlightedIndex: null,
      selectedItem: null,
      inputValue: '',
    }),
  )
})

test('getInputProps composes onChange with onInput', () => {
  const onChange = jest.fn()
  const onInput = jest.fn()
  const Input = jest.fn(props => <input {...props} />)
  const {ui} = setup({
    children({getInputProps}) {
      return (
        <div>
          <Input {...getInputProps({onChange, onInput})} />
        </div>
      )
    },
  })
  render(ui)
  expect(Input).toHaveBeenCalledTimes(1)
  const [[firstArg]] = Input.mock.calls
  expect(firstArg).toMatchObject({
    onInput: expect.any(Function),
  })
  expect(firstArg.onChange).toBeUndefined()
  const fakeEvent = {defaultPrevented: false, target: {value: ''}}
  firstArg.onInput(fakeEvent)
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(fakeEvent)
  expect(onInput).toHaveBeenCalledTimes(1)
  expect(onInput).toHaveBeenCalledWith(fakeEvent)
})

function setup({children = () => <div />, ...props} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const ui = <Downshift {...props}>{childSpy}</Downshift>
  return {childSpy, ui, ...renderArg}
}
