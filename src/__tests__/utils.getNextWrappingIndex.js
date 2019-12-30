import {getNextWrappingIndex} from '../utils'

test('should return next index', () => {
  const moveAmount = 1
  const baseIndex = 0
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
    ),
  ).toEqual(1)
})

test('should return previous index', () => {
  const moveAmount = -1
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
    ),
  ).toEqual(1)
})

test('should return previous index based on moveAmount', () => {
  const moveAmount = -2
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
    ),
  ).toEqual(0)
})

test('should wrap to first if circular and reached end', () => {
  const moveAmount = 3
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})
  const circular = true

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(0)
})

test('should not wrap to first if not circular and reached end', () => {
  const moveAmount = 3
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})
  const circular = false

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(2)
})

test('should wrap to last if circular and reached start', () => {
  const moveAmount = -3
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})
  const circular = true

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(2)
})

test('should not wrap to last if not circular and reached start', () => {
  const moveAmount = -3
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = () => ({hasAttribute: () => false})
  const circular = false

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(0)
})

test('should skip disabled when moving downwards', () => {
  const moveAmount = 1
  const baseIndex = 0
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 1})

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
    ),
  ).toEqual(2)
})

test('should skip disabled when moving upwards', () => {
  const moveAmount = -1
  const baseIndex = 2
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 1})

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
    ),
  ).toEqual(0)
})

test('should skip disabled and wrap to last if circular when reaching first', () => {
  const moveAmount = -1
  const baseIndex = 1
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 0})
  const circular = true

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(2)
})

test('should skip disabled and not wrap to last if circular when reaching first', () => {
  const moveAmount = -1
  const baseIndex = 1
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 0})
  const circular = false

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(1)
})

test('should skip disabled and wrap to first if circular when reaching last', () => {
  const moveAmount = 1
  const baseIndex = 1
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 2})
  const circular = true

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(0)
})

test('should skip disabled and not wrap to first if circular when reaching last', () => {
  const moveAmount = 1
  const baseIndex = 1
  const itemCount = 3
  const getItemNodeFromIndex = index => ({hasAttribute: () => index === 2})
  const circular = false

  expect(
    getNextWrappingIndex(
      moveAmount,
      baseIndex,
      itemCount,
      getItemNodeFromIndex,
      circular,
    ),
  ).toEqual(1)
})
