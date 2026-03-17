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

test('capitalizeString does not throw if input is a single character', () => {
  expect(() => capitalizeString('a')).not.toThrow()
  expect(capitalizeString('a')).toBe('A')
})

test('capitalizeString does not throw if input is already capitalized', () => {
  expect(() => capitalizeString('Downshift')).not.toThrow()
  expect(capitalizeString('Downshift')).toBe('Downshift')
})

test('capitalizeString does not throw if input is not a string', () => {
  expect(() => capitalizeString(123 as unknown as string)).not.toThrow()
  expect(capitalizeString(123 as unknown as string)).toBe('123')
})