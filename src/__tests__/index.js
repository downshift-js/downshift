import React from 'react'
import {mount} from 'enzyme'
import Autocomplete from '../'

function BasicAutocomplete() {
  const items = ['Red', 'Green', 'Blue', 'Orange', 'Purple']
  return (
    <Autocomplete onChange={() => {}}>
      <Autocomplete.Input />
      <Autocomplete.Menu>
        {() =>
          // prettier is doing weeeeird things to this
          // prettier-ignore
          items
            .map((item, index) => (
              <Autocomplete.Item
                value={item}
                index={index}
                key={item}
              >
                {item}
              </Autocomplete.Item>
            ))}
      </Autocomplete.Menu>
    </Autocomplete>
  )
}

test('renders', () => {
  expect(() => mount(<BasicAutocomplete />)).not.toThrow()
})
