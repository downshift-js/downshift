import {generateId, resetIdCounter, setIdCounter} from '../generateId'

jest.mock('react', () => {
  const {useId: _useId, ...react} =
    jest.requireActual<typeof import('react')>('react')
  return react
})

afterEach(() => {
  jest.clearAllMocks()
  resetIdCounter()
})

afterAll(() => {
  jest.restoreAllMocks()
})

test('generateId generates unique IDs', () => {
  resetIdCounter()
  expect(generateId()).toBe('0')
  expect(generateId()).toBe('1')
  expect(generateId()).toBe('2')
})

test('setIdCounter sets the idCounter to a specific number', () => {
  setIdCounter(100)
  expect(generateId()).toBe('100')
  expect(generateId()).toBe('101')
})

test('resetIdCounter resets the idCounter to 0', () => {
  setIdCounter(50)
  resetIdCounter()
  expect(generateId()).toBe('0')
  expect(generateId()).toBe('1')
})
