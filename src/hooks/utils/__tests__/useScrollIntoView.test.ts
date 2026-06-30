import {renderHook} from '@testing-library/react'

import {useScrollIntoView} from '../useScrollIntoView'

const defaultProps = {
  scrollIntoView: jest.fn(),
  highlightedIndex: -1,
  isOpen: false,
  menuElement: null as HTMLElement | null,
  itemElements: {},
  getItemId: (index: number) => `item-${index}`,
}

function renderScrollHook(props = {}) {
  const initialProps = {...defaultProps, ...props}
  const utils = renderHook(
    p =>
      useScrollIntoView(
        p.scrollIntoView,
        p.highlightedIndex,
        p.isOpen,
        {current: p.menuElement},
        {current: p.itemElements},
        p.getItemId,
      ),
    {
      initialProps,
    },
  )

  return utils
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('does not scroll when menu is not open', () => {
  renderScrollHook()

  expect(defaultProps.scrollIntoView).not.toHaveBeenCalled()
})

test('does not scroll when highlightedIndex is less than 0', () => {
  renderScrollHook({isOpen: true})

  expect(defaultProps.scrollIntoView).not.toHaveBeenCalled()
})

test('does not scroll when there are no item elements', () => {
  renderScrollHook({isOpen: true, highlightedIndex: 0})

  expect(defaultProps.scrollIntoView).not.toHaveBeenCalled()
})

test('does not scroll when there is no menu element', () => {
  renderScrollHook({
    isOpen: true,
    highlightedIndex: 0,
    itemElements: {'item-0': document.createElement('div')},
  })

  expect(defaultProps.scrollIntoView).not.toHaveBeenCalled()
})

test('scrolls into view the highlighted item', () => {
  const menuElement = document.createElement('div')
  const itemElement = document.createElement('div')

  renderScrollHook({
    isOpen: true,
    highlightedIndex: 0,
    menuElement,
    itemElements: {'item-0': itemElement},
  })

  expect(defaultProps.scrollIntoView).toHaveBeenCalledTimes(1)
  expect(defaultProps.scrollIntoView).toHaveBeenCalledWith(
    itemElement,
    menuElement,
  )
})

test('prevents scroll when preventScroll is called', () => {
  const menuElement = document.createElement('div')
  const itemElement = document.createElement('div')

  const {result, rerender} = renderScrollHook({
    isOpen: true,
    highlightedIndex: 0,
    menuElement,
    itemElements: {'item-0': itemElement},
  })

  jest.clearAllMocks()
  result.current()

  rerender({
    ...defaultProps,
    isOpen: true,
    highlightedIndex: 1,
    menuElement,
    itemElements: {'item-1': itemElement},
  })

  expect(defaultProps.scrollIntoView).not.toHaveBeenCalled()
})
