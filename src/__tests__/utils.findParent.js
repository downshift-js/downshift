import {findParent} from '../utils'

test('return documentElement when founded node is document.body and scrollTop is 0', () => {
  const node = document.createElement('div')
  const parentNode = document.body
  parentNode.appendChild(node)
  const scrollParent = findParent(el => el === parentNode, node, parentNode)
  expect(scrollParent).toBe(document.documentElement)
})
