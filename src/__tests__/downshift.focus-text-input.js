import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('input focus restored upon item mouse click', () => {
  const inputProps = {
    id: 'test-input',
    autoFocus: true,
  }
  const wrapper = getWrapper(['A', 'B'], inputProps)
  const input = wrapper.find(`input[id="${inputProps.id}"]`).first()
  const item = wrapper.find('[data-test="A"]').first()

  item.simulate('click')
  expect(document.activeElement).toBe(input.getDOMNode())
})

function getWrapper(items, inputProps) {
  const id = 'languages[0].name'

  return mount(
    <Downshift
      id={id}
      render={({getInputProps, getItemProps}) => (
        <div>
          <input {...getInputProps(inputProps)} />
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
