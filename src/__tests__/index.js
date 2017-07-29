import React from 'react'
import {mount} from 'enzyme'
import Autocomplete from '../'

function BasicAutocomplete() {
  const items = ['Red', 'Green', 'Blue', 'Orange', 'Purple']
  return (
    <Autocomplete onChange={() => {}}>
      <Autocomplete.Input />
      <Autocomplete.Menu>
        {({isOpen}) =>
          isOpen &&
          <div>
            {items.map((item, index) =>
              (<Autocomplete.Item value={item} index={index} key={item}>
                {item}
              </Autocomplete.Item>),
            )}
          </div>}
      </Autocomplete.Menu>
    </Autocomplete>
  )
}

test('renders', () => {
  expect(() => mount(<BasicAutocomplete />)).not.toThrow()
})
