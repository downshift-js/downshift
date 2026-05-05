import {isDropdownStateEqual} from '../isDropdownStateEqual'

test('state is equal when every property is equal', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 2,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 2,
    inputValue: 'hi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(true)
})

test('state is not equal when every selectedItem differs by reference', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 2,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: true,
    selectedItem: {...selectedItem},
    highlightedIndex: 2,
    inputValue: 'hi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(false)
})

test('state is not equal when highlightedIndex is different', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 2,
    inputValue: 'hi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(false)
})

test('state is not equal when isOpen is different', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: false,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(false)
})

test('state is not equal when inputValue is different', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hhhi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(false)
})

test('state is not equal when selectedItem is different', () => {
  const selectedItem = {value: 'bla'}
  const prevState = {
    isOpen: true,
    selectedItem,
    highlightedIndex: 3,
    inputValue: 'hi',
  }
  const nextState = {
    isOpen: true,
    selectedItem: null,
    highlightedIndex: 3,
    inputValue: 'hhhi',
  }

  expect(isDropdownStateEqual(prevState, nextState)).toEqual(false)
})
