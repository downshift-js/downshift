import {capitalizeString} from '../capitalizeString'

test('capitalizeString capitalizes the first letter of a string', () => {
  expect(capitalizeString('downshift')).toBe('Downshift')
})

test('capitalizeString does not modify the rest of the string', () => {
  expect(capitalizeString('dOWNsHIFT')).toBe('DOWNsHIFT')
})

test('capitalizeString returns an empty string if input is empty', () => {
  expect(capitalizeString('')).toBe('')
})
