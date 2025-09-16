import {targetWithinDownshift} from '../utils'

test('returns false if environment is not defined', () => {
  expect(targetWithinDownshift(null, [], null)).toBe(false)
})

test('returns false if the target is not within the downshift', () => {
  const downshift = document.createElement('div')
  downshift.innerHTML = '<div id="target"></div>'
  expect(targetWithinDownshift(null, [downshift], window)).toBe(false)
})

test('correctly identifies active elements nested in shadow DOM', () => {
  // Create a host element for the shadow DOM
  const hostElement = document.createElement('div')
  document.body.appendChild(hostElement)

  // Attach a shadow root to the host element
  const shadowRoot = hostElement.attachShadow({mode: 'open'})

  // Create an element inside the shadow root
  const innerElement = document.createElement('button')
  innerElement.setAttribute('data-testid', 'inner-button')
  shadowRoot.appendChild(innerElement)

  // Create another nested level with another shadow root
  const nestedHost = document.createElement('div')
  shadowRoot.appendChild(nestedHost)

  const nestedShadowRoot = nestedHost.attachShadow({mode: 'open'})

  const deepActiveElement = document.createElement('button')

  // Create some downshift elements
  const downshiftElement = document.createElement('div')
  nestedShadowRoot.appendChild(downshiftElement)
  downshiftElement.appendChild(deepActiveElement)

  // Focus the deep element to make it the active element
  deepActiveElement.focus()

  expect(hostElement.shadowRoot).toBe(shadowRoot)
  expect(nestedHost.shadowRoot).toBe(nestedShadowRoot)
  expect(nestedShadowRoot.activeElement).toBe(deepActiveElement)

  // Test the function with the active element in the shadow DOM
  expect(
    targetWithinDownshift(deepActiveElement, [downshiftElement], window, true),
  ).toBe(true)

  // Test with a non-related element
  const unrelatedElement = document.createElement('div')
  expect(
    targetWithinDownshift(unrelatedElement, [downshiftElement], window, true),
  ).toBe(true) // Should still be true because of activeElement check

  // Cleanup
  document.body.removeChild(hostElement)
})
