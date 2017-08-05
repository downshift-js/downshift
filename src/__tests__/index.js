import React from 'react'
import {mount} from 'enzyme'
import Autocomplete from '../'

function BasicAutocomplete() {
  const items = ['Red', 'Green', 'Blue', 'Orange', 'Purple']
  return (
    <Autocomplete onChange={() => {}}>
      {({isOpen, getInputProps, getItemProps}) =>
        (<div>
          <input {...getInputProps()} />
          {isOpen &&
            <div>
              {items.map((item, index) =>
                (<div key={item} {...getItemProps({value: item, index})}>
                  {item}
                </div>),
              )}
            </div>}
        </div>)}
    </Autocomplete>
  )
}

test('renders', () => {
  expect(() => mount(<BasicAutocomplete />)).not.toThrow()
})
