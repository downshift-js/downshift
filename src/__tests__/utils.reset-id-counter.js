import {resetIdCounter} from '../utils'

test('does not throw', () => {
  expect(() => resetIdCounter()).not.toThrow()
})
