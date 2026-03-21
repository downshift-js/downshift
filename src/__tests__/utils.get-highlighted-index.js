import {getHighlightedIndex} from '../utils'

test('should return next index', () => {
  const offset = 1
  const start = 0
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }

  expect(getHighlightedIndex(start, offset, items, isItemDisabled)).toEqual(1)
})

test('should return previous index', () => {
  const offset = -1
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }

  expect(getHighlightedIndex(start, offset, items, isItemDisabled)).toEqual(1)
})

test('should return previous index based on moveAmount', () => {
  const offset = -2
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }

  expect(getHighlightedIndex(start, offset, items, isItemDisabled)).toEqual(0)
})

test('should wrap to first if circular and reached end', () => {
  const offset = 3
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(0)
})

test('should not wrap to first if not circular and reached end', () => {
  const offset = 3
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }
  const circular = false

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(2)
})

test('should wrap to last if circular and reached start', () => {
  const offset = -3
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(2)
})

test('should not wrap to last if not circular and reached start', () => {
  const offset = -3
  const start = 2
  const items = {length: 3}
  function isItemDisabled() {
    return false
  }
  const circular = false

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(0)
})

test('should skip disabled when moving downwards', () => {
  const offset = 1
  const start = 0
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 1
  }

  expect(getHighlightedIndex(start, offset, items, isItemDisabled)).toEqual(2)
})

test('should skip disabled when moving upwards', () => {
  const offset = -1
  const start = 2
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 1
  }

  expect(getHighlightedIndex(start, offset, items, isItemDisabled)).toEqual(0)
})

test('should skip disabled and wrap to last if circular when reaching first', () => {
  const offset = -1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 0
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(2)
})

test('should skip disabled and wrap to second to last if circular when reaching first and last is disabled', () => {
  const offset = -1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return [0, 2].includes(index)
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(1)
})

test('should skip disabled and not wrap to last if circular when reaching first', () => {
  const offset = -1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 0
  }
  const circular = false

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(1)
})

test('should skip disabled and wrap to first if circular when reaching last', () => {
  const offset = 1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 2
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(0)
})

test('should skip disabled and wrap to second if circular when reaching last and first is disabled', () => {
  const offset = 1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return [0, 2].includes(index)
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(1)
})

test('should skip disabled and not wrap to first if circular when reaching last', () => {
  const offset = 1
  const start = 1
  const items = {length: 3}
  function isItemDisabled(_item, index) {
    return index === 2
  }
  const circular = false

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(1)
})

test('should not select any if all disabled when arrow up', () => {
  const offset = -1
  const start = -1
  const items = {length: 3}
  function isItemDisabled() {
    return true
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(-1)
})

test('should not select any if all disabled when arrow down', () => {
  const offset = 1
  const start = -1
  const items = {length: 3}
  function isItemDisabled() {
    return true
  }
  const circular = true

  expect(
    getHighlightedIndex(start, offset, items, isItemDisabled, circular),
  ).toEqual(-1)
})
