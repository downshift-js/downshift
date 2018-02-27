import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'
import {resetIdCounter} from '../utils'

test('renders with correct and predictable auto generated id upon resetIdCounter call', () => {
  resetIdCounter()

  const render = ({getInputProps, getLabelProps, getItemProps}) => (
    <div>
      <label {...getLabelProps()} />
      <input {...getInputProps()} />
      <div>
        <span
          {...getItemProps({
            item: 0,
            'data-test': 'item-0',
          })}
        >
          0
        </span>
      </div>
    </div>
  )

  const {id, wrapper} = setup({render})
  const label = wrapper.find('label').first()
  const input = wrapper.find('input').first()
  const item = wrapper.find('[data-test="item-0"]').first()
  expect(id).toBe('downshift-0')
  expect(label.instance().getAttribute('for')).toBe('downshift-0-input')
  expect(input.instance().getAttribute('id')).toBe('downshift-0-input')
  expect(item.instance().getAttribute('id')).toBe('downshift-0-item-0')

  const {id: id2, wrapper: wrapper2} = setup({render})
  const label2 = wrapper2.find('label').first()
  const input2 = wrapper2.find('input').first()
  const item2 = wrapper2.find('[data-test="item-0"]').first()
  expect(id2).toBe('downshift-1')
  expect(label2.instance().getAttribute('for')).toBe('downshift-1-input')
  expect(input2.instance().getAttribute('id')).toBe('downshift-1-input')
  expect(item2.instance().getAttribute('id')).toBe('downshift-1-item-0')

  resetIdCounter()

  const {id: id3, wrapper: wrapper3} = setup({render})
  const label3 = wrapper3.find('label').first()
  const input3 = wrapper3.find('input').first()
  const item3 = wrapper3.find('[data-test="item-0"]').first()
  expect(id3).toBe('downshift-0')
  expect(label3.instance().getAttribute('for')).toBe('downshift-0-input')
  expect(input3.instance().getAttribute('id')).toBe('downshift-0-input')
  expect(item3.instance().getAttribute('id')).toBe('downshift-0-item-0')
})

function setup({render = () => <div />, ...props} = {}) {
  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return render(controllerArg)
  })
  const wrapper = mount(<Downshift {...props} render={renderSpy} />)
  return {wrapper, ...renderArg}
}
