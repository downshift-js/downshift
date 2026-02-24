import {isDropdownStateEqual} from '../isDropdownStateEqual'

test('is true when each property is equal', () => {
  const selectedItem = 'hello'
  const prevState = {
    highlightedIndex: 2,
    isOpen: true,
    selectedItem,
    inputValue: selectedItem,
  }
  const newState = {
    ...prevState,
  }

  expect(isDropdownStateEqual(prevState, newState)).toBe(true)
})

test('is false when at least one property is not equal', () => {
  const selectedItem = {value: 'hello'}
  const prevState = {
    highlightedIndex: 2,
    isOpen: true,
    selectedItem,
    inputValue: selectedItem.value,
  }
  const newState = {
    ...prevState,
    selectedItem: {...selectedItem},
  }

  expect(isDropdownStateEqual(prevState, newState)).toBe(false)
})
