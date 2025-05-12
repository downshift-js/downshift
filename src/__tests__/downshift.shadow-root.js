import * as React from 'react'
import {render} from '@testing-library/react'
import Downshift from '../'
import DropdownSelect from '../../test/useSelect.test'
import DropdownCombobox from '../../test/useCombobox.test'
import DropdownMultipleSelect from '../../test/useMultipleSelect.test'
import {ReactShadowRoot} from '../../test/react-shadow'

const Wrapper = ({children}) => {
  return <ReactShadowRoot>{children}</ReactShadowRoot>
}

test('Downshift renders with a shadow root', () => {
  const {container} = render(<Downshift />, {wrapper: Wrapper})

  expect(container.shadowRoot).toBeDefined()
})

test('DropdownSelect renders with a shadow root', () => {
  const {container} = render(<DropdownSelect />, {wrapper: Wrapper})

  expect(container.shadowRoot).toBeDefined()
})

test('DropdownCombobox renders with a shadow root', () => {
  const {container} = render(<DropdownCombobox />, {wrapper: Wrapper})

  expect(container.shadowRoot).toBeDefined()
})

test('DropdownMultipleSelect renders with a shadow root', () => {
  const {container} = render(<DropdownMultipleSelect />, {wrapper: Wrapper})

  expect(container.shadowRoot).toBeDefined()
})
