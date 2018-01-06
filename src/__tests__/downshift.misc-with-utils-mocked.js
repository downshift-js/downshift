// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'
import {scrollIntoView} from '../utils'

jest.useFakeTimers()
jest.mock('../utils')

test('does not scroll from an onMouseMove event', () => {
  class HighlightedIndexController extends React.Component {
    state = {highlightedIndex: 10}
    handleStateChange = changes => {
      if (changes.hasOwnProperty('highlightedIndex')) {
        this.setState({highlightedIndex: changes.highlightedIndex})
      }
    }
    render() {
      return (
        <Downshift
          onStateChange={this.handleStateChange}
          highlightedIndex={this.state.highlightedIndex}
          render={({getInputProps, getItemProps}) => (
            <div>
              <input {...getInputProps()} />
              <div {...getItemProps({item: 'hi', 'data-test': 'item-1'})} />
              <div {...getItemProps({item: 'hey', 'data-test': 'item-2'})} />
            </div>
          )}
        />
      )
    }
  }
  const wrapper = mount(<HighlightedIndexController />)
  const input = wrapper.find('input')
  const item = wrapper.find(sel('item-1'))
  item.simulate('mousemove')
  jest.runAllTimers()
  expect(scrollIntoView).not.toHaveBeenCalled()
  // now let's make sure that we can still scroll items into view
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(scrollIntoView).toHaveBeenCalled()
})

function sel(id) {
  return `[data-test="${id}"]`
}

/* eslint no-console:0 */
