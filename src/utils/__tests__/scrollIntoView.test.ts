import {compute} from 'compute-scroll-into-view'
import {scrollIntoView} from '../scrollIntoView'

// eslint-disable-next-line no-var
var el = {
  scrollTop: 0,
  scrollLeft: 0,
}

jest.mock('compute-scroll-into-view', () => ({
  compute: jest.fn(() => [{el, top: 5, left: 10}]),
}))

test('scrollIntoView does not call compute if node is undefined', () => {
  scrollIntoView(undefined, undefined)
  expect(compute).not.toHaveBeenCalled()
})

test('scrollIntoView calls compute with correct parameters', () => {
  const node = document.createElement('div')
  const menuNode = document.createElement('div')

  scrollIntoView(node, menuNode)

  expect(compute).toHaveBeenCalledTimes(1)
  expect(compute).toHaveBeenCalledWith(node, {
    boundary: menuNode,
    block: 'nearest',
    scrollMode: 'if-needed',
  })
  expect(el.scrollTop).toBe(5)
  expect(el.scrollLeft).toBe(10)
})
