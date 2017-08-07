import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

function BasicDownshift() {
  const items = ['Red', 'Green', 'Blue', 'Orange', 'Purple', 'Pink']
  return (
    <Downshift onChange={() => {}}>
      {({isOpen, getInputProps, getItemProps}) =>
        (<div>
          <input {...getInputProps()} />
          {isOpen &&
            <div>
              {items.map((item, index) =>
                (<div key={item} {...getItemProps({item, index})}>
                  {item}
                </div>),
              )}
            </div>}
        </div>)}
    </Downshift>
  )
}

test('renders', () => {
  expect(() => mount(<BasicDownshift />)).not.toThrow()
})
