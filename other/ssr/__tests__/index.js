import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Downshift from '../../../src'

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

/* eslint jsx-a11y/label-has-for:0 */
