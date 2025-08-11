import {scrollIntoView} from '../utils-ts'

test('does not throw with a null node', () => {
  expect(() => scrollIntoView(null)).not.toThrow()
})

test('does not throw if the given node is the root node', () => {
  const node = getNode()
  expect(() => scrollIntoView(node, node)).not.toThrow()
})

test('does nothing if the node is within the scrollable area', () => {
  const scrollableScrollTop = 2
  const node = getNode({height: 10, top: 6})
  const scrollableNode = getScrollableNode({
    scrollTop: scrollableScrollTop,
    children: [node],
  })
  scrollIntoView(node, scrollableNode)
  expect(scrollableNode.scrollTop).toBe(scrollableScrollTop)
})

test('does nothing if parent.top is above view area and node within view', () => {
  const scrollableScrollTop = 1000
  const node = getNode({height: 40, top: 300})
  // parent bounds is [-1000 + 1000, -500 + 1000] = [0, 500]
  // node bounds is [300, 340] => node within visible area
  const scrollableNode = getScrollableNode({
    top: -1000,
    height: 500,
    scrollTop: scrollableScrollTop,
    children: [node],
  })
  scrollIntoView(node, scrollableNode)
  expect(scrollableNode.scrollTop).toBe(scrollableScrollTop)
})

test('aligns to top when the node is above the scrollable parent', () => {
  // TODO: make this test a tiny bit more readable/maintainable...
  const nodeTop = 2
  const scrollableScrollTop = 13
  const node = getNode({height: 10, top: nodeTop})
  const scrollableNode = getScrollableNode({
    top: 10,
    scrollTop: scrollableScrollTop,
    children: [node],
  })
  scrollIntoView(node, scrollableNode)
  expect(scrollableNode.scrollTop).toBe(5)
})

test('aligns to top of scrollable parent when the node is above view area', () => {
  const node = getNode({height: 40, top: -50})
  const scrollableNode = getScrollableNode({
    top: 50,
    scrollTop: 100,
    children: [node],
  })
  scrollIntoView(node, scrollableNode)
  expect(scrollableNode.scrollTop).toBe(0)
})

test('aligns to bottom when the node is below the scrollable parent', () => {
  const nodeTop = 115
  const node = getNode({height: 10, top: nodeTop})
  const scrollableNode = getScrollableNode({
    height: 100,
    children: [node],
  })
  scrollIntoView(node, scrollableNode)
  expect(scrollableNode.scrollTop).toBe(25)
})

function getScrollableNode(overrides = {}) {
  return getNode({
    height: 100,
    top: 0,
    scrollTop: 0,
    scrollHeight: 150,
    ...overrides,
  })
}

function getNode({
  top = 0,
  height = 0,
  scrollTop = 0,
  scrollHeight = height,
  clientHeight = height,
  children = [],
  borderBottomWidth = 0,
  borderTopWidth = 0,
} = {}) {
  const div = document.createElement('div')
  div.getBoundingClientRect = () => ({
    width: 50,
    height,
    top,
    left: 0,
    right: 50,
    bottom: top + height,
  })
  div.style.borderTopWidth = borderTopWidth
  div.style.borderBottomWidth = borderBottomWidth
  div.scrollTop = scrollTop

  Object.defineProperties(div, {
    clientHeight: {value: clientHeight},
    offsetHeight: {value: clientHeight},
    scrollHeight: {value: scrollHeight},
  })
  children.forEach(child => div.appendChild(child))
  document.documentElement.appendChild(div)
  return div
}
