import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('focus restored upon item mouse click', () => {
  const wrapper = getWrapper(['A', 'B'])
  const input = wrapper.find(`input`).first()
  const button = wrapper.find('button').first()
  const item = wrapper.find('[data-test="A"]').first()

  expect(document.activeElement.nodeName).toEqual('BODY')

  const inputNode = input.getDOMNode()
  const buttonNode = button.getDOMNode()

  inputNode.focus()
  expect(document.activeElement).toBe(inputNode)

  item.simulate('click')
  expect(document.activeElement).toBe(inputNode)

  buttonNode.focus()
  expect(document.activeElement).toBe(buttonNode)

  item.simulate('click')
  expect(document.activeElement).toBe(buttonNode)
})

function getWrapper(items) {
  const id = 'languages[0].name'

  return mount(
    <Downshift
      id={id}
      render={({getInputProps, getItemProps, getButtonProps}) => (
        <div>
          <input {...getInputProps()} />
          <button {...getButtonProps()} />
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
