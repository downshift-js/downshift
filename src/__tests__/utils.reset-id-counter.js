import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'
import {resetIdCounter} from '../utils'

test('does not throw', () => {
  expect(() => resetIdCounter()).not.toThrow()
})

test('renders with correct and predictable auto generated id upon resetIdCounter call', () => {
  resetIdCounter()

  const render = ({getInputProps, getLabelProps}) => (
    <div>
      <label {...getLabelProps()} />
      <input {...getInputProps()} />
    </div>
  )

  const {id, wrapper} = setup({render})
  const label = wrapper.find('label').first()
  const input = wrapper.find('input').first()
  expect(id).toBe('downshift-0')
  expect(label.instance().getAttribute('for')).toBe('downshift-input-0')
  expect(input.instance().getAttribute('id')).toBe('downshift-input-0')

  const {id: id2, wrapper: wrapper2} = setup({render})
  const label2 = wrapper2.find('label').first()
  const input2 = wrapper2.find('input').first()
  expect(id2).toBe('downshift-1')
  expect(label2.instance().getAttribute('for')).toBe('downshift-input-1')
  expect(input2.instance().getAttribute('id')).toBe('downshift-input-1')

  resetIdCounter()

  const {id: id3, wrapper: wrapper3} = setup({render})
  const label3 = wrapper3.find('label').first()
  const input3 = wrapper3.find('input').first()
  expect(id3).toBe('downshift-0')
  expect(label3.instance().getAttribute('for')).toBe('downshift-input-0')
  expect(input3.instance().getAttribute('id')).toBe('downshift-input-0')
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
