import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import Downshift, {resetIdCounter} from '../../../src'

test('does not throw an error when server rendering', () => {
  expect(() => {
    ReactDOMServer.renderToString(
      <Downshift id="my-autocomplete-component">
        {({getInputProps, getLabelProps}) => (
          <div>
            <label {...getLabelProps({htmlFor: 'my-autocomplete-input'})} />
            <input {...getInputProps({id: 'my-autocomplete-input'})} />
          </div>
        )}
      </Downshift>,
    )
  }).not.toThrow()
})

if (!('useId' in React)) {
  test('resets idCounter', () => {
    const getRenderedString = () => {
      resetIdCounter()
      return ReactDOMServer.renderToString(
        <Downshift id="my-autocomplete-component">
          {({getInputProps, getLabelProps}) => (
            <div>
              <label {...getLabelProps()} />
              <input {...getInputProps()} />
            </div>
          )}
        </Downshift>,
      )
    }

    const firstRun = getRenderedString()
    const secondRun = getRenderedString()

    expect(firstRun).toBe(secondRun)
  })
}

/* eslint jsx-a11y/label-has-for:0 */
