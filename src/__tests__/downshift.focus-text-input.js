import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('input is focused upon item mouse click', () => {
  const wrapper = getWrapper(['A', 'B'])
  const item = wrapper.find('[data-test="A"]').first()

  expect(document.activeElement.nodeName).toEqual('BODY')

  item.simulate('click')

  expect(document.activeElement.nodeName).toEqual('INPUT')
})

function getWrapper(items) {
  const id = 'languages[0].name'

  return mount(
    <Downshift
      id={id}
      render={({getInputProps, getItemProps}) => (
        <div>
          <input {...getInputProps({id})} />
          <div>
            {items.map(item => (
              <div data-test={item} key={item} {...getItemProps({item})}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    />,
  )
}
