import * as React from 'react'
import {render, buildQueries, queryAllByRole} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Downshift from '../'
import DropdownSelect from '../../test/useSelect.test'
import DropdownCombobox, {colors} from '../../test/useCombobox.test'
import DropdownMultipleSelect from '../../test/useMultipleSelect.test'
import ComboBox from '../../test/downshift.test'
import {ReactShadowRoot} from '../../test/react-shadow'

function _queryAllByRoleDeep(container, ...rest) {
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const result = queryAllByRole(container, ...rest) // replace here with different queryAll* variants.
  for (const element of container.querySelectorAll('*')) {
    if (element.shadowRoot) {
      result.push(..._queryAllByRoleDeep(element.shadowRoot, ...rest))
    }
  }

  return result
}

const [
  _queryByRoleDeep,
  _getAllByRoleDeep,
  _getByRoleDeep,
  _findAllByRoleDeep,
  _findByRoleDeep,
] = buildQueries(
  _queryAllByRoleDeep,
  (_, role) => `Found multiple elements with the role ${role}`,
  (_, role) => `Unable to find an element with the role ${role}`,
)

const getAllByRoleDeep = _getAllByRoleDeep.bind(null, document.body)
const getByRoleDeep = _getByRoleDeep.bind(null, document.body)

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

test('DropdownSelect works correctly in shadow DOM', async () => {
  const user = userEvent.setup()
  const {container} = render(<DropdownSelect />, {wrapper: Wrapper})

  // Verify shadow root exists
  expect(container.shadowRoot).toBeDefined()

  // Get elements within the shadow root
  const toggleButton = getByRoleDeep('combobox')
  const menu = getByRoleDeep('listbox')
  expect(toggleButton).toBeInTheDocument()
  expect(menu).toBeInTheDocument()

  // Initially menu should be closed
  expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

  // Open the dropdown
  await user.click(toggleButton)

  // Menu should now be open
  expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

  // Select an item
  const blackOption = getByRoleDeep('option', {name: 'Black'})
  await user.click(blackOption)

  // Menu should close and selected item should appear in button
  expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  expect(toggleButton).toHaveTextContent('Black')

  // Open it again
  await user.click(toggleButton)
  expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

  // Click outside (this tests our targetWithinDownshift with composedPath)
  await user.click(document.body)

  // Menu should close
  expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
})

test('DropdownCombobox works correctly in shadow DOM', async () => {
  const user = userEvent.setup()
  const {container} = render(<DropdownCombobox />, {wrapper: Wrapper})

  // Verify shadow root exists
  expect(container.shadowRoot).toBeDefined()

  // Get elements within the shadow root
  const input = getByRoleDeep('combobox')
  const toggleButton = getByRoleDeep('button', {name: 'toggle menu'})
  const clearButton = getByRoleDeep('button', {name: 'clear'})
  const menu = getByRoleDeep('listbox')

  expect(input).toBeInTheDocument()
  expect(toggleButton).toBeInTheDocument()
  expect(clearButton).toBeInTheDocument()
  expect(menu).toBeInTheDocument()

  // Initially menu should be closed
  expect(input).toHaveAttribute('aria-expanded', 'false')
  expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

  // Open the dropdown
  await user.click(toggleButton)

  // Menu should now be open
  expect(input).toHaveAttribute('aria-expanded', 'true')

  // All colors should initially be visible
  const items = getAllByRoleDeep('option')
  expect(items).toHaveLength(colors.length)

  // Select an item
  await user.click(items[0])

  // Menu should close and input should have selected value
  expect(input).toHaveAttribute('aria-expanded', 'false')
  expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  expect(input).toHaveValue('Black')

  // Clear the selection
  await user.click(clearButton)

  // Input should be empty
  expect(input).toHaveValue('')

  // Open it again
  await user.click(toggleButton)
  expect(input).toHaveAttribute('aria-expanded', 'true')

  // Click outside to close
  await user.click(document.body)

  // Menu should close
  expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('Downshift button blur correctly handles focus moving to external shadow DOM', async () => {
  const user = userEvent.setup()
  const {container} = render(<ComboBox />, {wrapper: Wrapper})

  // Verify Downshift's own shadow root exists
  expect(container.shadowRoot).toBeDefined()

  const comboboxRoot = getByRoleDeep('combobox')
  const toggleButton = container.shadowRoot.querySelector(
    '[data-testid="combobox-toggle-button"]',
  )

  // Open the dropdown
  await user.click(toggleButton)
  expect(comboboxRoot).toHaveAttribute('aria-expanded', 'true')

  // Click the element inside the external shadow DOM
  // This should focus externalFocusableButton and blur toggleButton (or the root/input depending on what had focus)
  const externalHost = document.createElement('div')
  document.body.appendChild(externalHost)
  const shadow = externalHost.attachShadow({mode: 'open'})
  const externalFocusableButton = document.createElement('button')
  shadow.appendChild(externalFocusableButton)
  await user.click(externalFocusableButton)

  // Assert that the menu closes due to blur
  // Downshift's blur handlers use setTimeout, so wait for the next macrotask
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(comboboxRoot).toHaveAttribute('aria-expanded', 'false')

  // Cleanup
  document.body.removeChild(externalHost)
})

test('Downshift input blur correctly handles focus moving to external shadow DOM', async () => {
  const user = userEvent.setup()
  const {container} = render(<ComboBox />, {wrapper: Wrapper})

  // Verify Downshift's own shadow root exists
  expect(container.shadowRoot).toBeDefined()

  const comboboxRoot = getByRoleDeep('combobox')
  const inputField = container.shadowRoot.querySelector(
    '[data-testid="combobox-input"]',
  )
  const downshiftToggleButton = container.shadowRoot.querySelector(
    '[data-testid="combobox-toggle-button"]',
  )

  // Create an external element with its own shadow DOM
  const externalHost = document.createElement('div')
  document.body.appendChild(externalHost)
  const shadow = externalHost.attachShadow({mode: 'open'})
  const externalFocusableButton = document.createElement('button')
  shadow.appendChild(externalFocusableButton)

  // Open the dropdown by clicking the toggle button
  await user.click(downshiftToggleButton)
  expect(comboboxRoot).toHaveAttribute('aria-expanded', 'true')

  // Ensure the input itself is focused before it blurs
  inputField.focus()
  await user.type(inputField, 'b')
  await user.keyboard('{Tab}')
  // Click the element inside the external shadow DOM
  // This should focus externalFocusableButton and blur the input
  await user.click(externalFocusableButton)

  // Assert that the menu closes due to blur
  // Downshift's blur handlers use setTimeout, so wait for the next macrotask
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(comboboxRoot).toHaveAttribute('aria-expanded', 'false')

  // Cleanup
  document.body.removeChild(externalHost)
})

test('useCombobox input blur correctly handles focus moving to external shadow DOM', async () => {
  const user = userEvent.setup()
  const {container} = render(<DropdownCombobox />, {wrapper: Wrapper})

  // Verify DropdownCombobox's own shadow root exists via the Wrapper
  expect(container.shadowRoot).toBeDefined()

  const input = container.shadowRoot.querySelector(
    '[data-testid="combobox-input"]',
  )
  const toggleButton = container.shadowRoot.querySelector(
    '[data-testid="combobox-toggle-button"]',
  )

  // Create an external element with its own shadow DOM
  const externalHost = document.createElement('div')
  document.body.appendChild(externalHost)
  const shadow = externalHost.attachShadow({mode: 'open'})
  const externalFocusableButton = document.createElement('button')
  shadow.appendChild(externalFocusableButton)

  // Open the dropdown by clicking the toggle button
  await user.click(toggleButton)
  expect(input).toHaveAttribute('aria-expanded', 'true')

  // Ensure the input itself is focused before it blurs
  input.focus()
  await user.type(input, 'b')
  await user.keyboard('{Tab}')

  // Click the element inside the external shadow DOM
  // This should focus externalFocusableButton and blur the input in DropdownCombobox
  await user.click(externalFocusableButton)

  // Assert that the menu closes due to blur
  // useCombobox's blur handler uses setTimeout, so wait for the next macrotask
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input).toHaveAttribute('aria-expanded', 'false')

  // Cleanup
  document.body.removeChild(externalHost)
})
