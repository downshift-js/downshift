/* eslint-disable testing-library/prefer-screen-queries */
import useTagGroup from '..'
import {A11Y_DESCRIPTION_ELEMENT_ID} from '../utils'
import {
  renderTagGroup,
  renderHook,
  colors,
  renderUseTagGroup,
  act,
  defaultProps,
} from './utils'

describe('props', () => {
  test('passing no props object will still work', () => {
    const result = renderHook(() => useTagGroup())

    expect(result.result.current.getTagGroupProps).toBeDefined()
  })

  test('initialActiveIndex sets activeIndex at mount', () => {
    const {getTags} = renderTagGroup({
      initialActiveIndex: 1,
    })

    const tags = getTags()

    expect(tags[0]).toHaveAttribute('tabindex', '-1')
    expect(tags[1]).toHaveAttribute('tabindex', '0')
    expect(tags[2]).toHaveAttribute('tabindex', '-1')
  })

  test('initialActiveIndex does not focus active item at mount', () => {
    const {getTags} = renderTagGroup({
      initialActiveIndex: 1,
    })

    const tags = getTags()

    expect(tags[1]).not.toHaveFocus()
  })

  test('activeIndex controls the activeIndex state', async () => {
    const {getTags, clickOnTag} = renderTagGroup({
      activeIndex: 1,
    })

    const tags = getTags()

    await clickOnTag(0)

    expect(tags[0]).toHaveAttribute('tabindex', '-1')
    expect(tags[1]).toHaveAttribute('tabindex', '0')

    await clickOnTag(2)

    expect(tags[2]).toHaveAttribute('tabindex', '-1')
    expect(tags[1]).toHaveAttribute('tabindex', '0')
  })

  test('initialItems sets items at mount', () => {
    const {getTags} = renderTagGroup({
      initialItems: [colors[2] as string],
    })

    const tags = getTags()

    expect(tags).toHaveLength(1)
    expect(tags[0]).toHaveTextContent(colors[2] as string)
  })

  test('items controls the items state', async () => {
    const {result} = renderUseTagGroup({items: [colors[2] as string]})

    act(() => {
      result.current.addItem(colors[3] as string)
    })

    expect(result.current.items).toEqual([colors[2]])
  })

  test('id if passed will override downshift default', () => {
    const {getTagGroup, getTags} = renderTagGroup({
      id: 'my-custom-little-id',
    })
    const elements = [getTagGroup(), ...getTags()]

    elements.forEach(element => {
      expect(element).toHaveAttribute(
        'id',
        expect.stringContaining('my-custom-little-id'),
      )
    })
  })

  test('tagGroupId if passed will override downshift default', () => {
    const {getTagGroup} = renderTagGroup({
      tagGroupId: 'my-custom-little-id',
      id: 'should-be-overriden',
    })

    expect(getTagGroup()).toHaveAttribute('id', 'my-custom-little-id')
  })

  test('getTagId if passed will override downshift default', () => {
    const {getTags} = renderTagGroup({
      getTagId(index) {
        return `custom-${index}`
      },
      id: 'should-be-overriden',
    })

    getTags().forEach((element, index) => {
      expect(element).toHaveAttribute('id', `custom-${index}`)
    })
  })

  test('stateReducer gets called before using addItem', () => {
    const stateReducer = jest.fn().mockImplementation((_s, c) => c.changes)
    const {result} = renderUseTagGroup({stateReducer})

    act(() => {
      result.current.addItem('test')
    })

    expect(stateReducer).toHaveBeenCalledTimes(1)
    expect(stateReducer).toHaveBeenNthCalledWith(
      1,
      {
        activeIndex: 0,
        items: defaultProps.initialItems,
      },
      {
        changes: {
          activeIndex: 0,
          items: [...defaultProps.initialItems, 'test'],
        },
        index: undefined,
        item: 'test',
        type: useTagGroup.stateChangeTypes.FunctionAddItem,
      },
    )
  })

  test('stateReducer gets called before any new state update', async () => {
    const stateReducer = jest.fn().mockImplementation((_s, c) => c.changes)
    const {user, clickOnTag, clickOnRemoveTag} = renderTagGroup({
      stateReducer,
    })

    expect(stateReducer).not.toHaveBeenCalled()

    await clickOnTag(3)

    expect(stateReducer).toHaveBeenCalledTimes(1)
    expect(stateReducer).toHaveBeenNthCalledWith(
      1,
      {
        activeIndex: 0,
        items: defaultProps.initialItems,
      },
      {
        changes: {
          activeIndex: 3,
          items: defaultProps.initialItems,
        },
        index: 3,
        type: useTagGroup.stateChangeTypes.TagClick,
      },
    )

    await user.keyboard('{ArrowLeft}')

    expect(stateReducer).toHaveBeenCalledTimes(2)
    expect(stateReducer).toHaveBeenNthCalledWith(
      2,
      {
        activeIndex: 3,
        items: defaultProps.initialItems,
      },
      {
        changes: {
          activeIndex: 2,
          items: defaultProps.initialItems,
        },
        type: useTagGroup.stateChangeTypes.TagGroupKeyDownArrowLeft,
      },
    )

    await user.keyboard('{ArrowRight}')

    expect(stateReducer).toHaveBeenCalledTimes(3)
    expect(stateReducer).toHaveBeenNthCalledWith(
      3,
      {
        activeIndex: 2,
        items: defaultProps.initialItems,
      },
      {
        changes: {
          activeIndex: 3,
          items: defaultProps.initialItems,
        },
        type: useTagGroup.stateChangeTypes.TagGroupKeyDownArrowRight,
      },
    )

    await user.keyboard('{Backspace}')

    const newItemsAfterBackspace = [
      ...defaultProps.initialItems.slice(0, 3),
      ...defaultProps.initialItems.slice(4),
    ]

    expect(stateReducer).toHaveBeenCalledTimes(4)
    expect(stateReducer).toHaveBeenNthCalledWith(
      4,
      {
        activeIndex: 3,
        items: defaultProps.initialItems,
      },
      {
        changes: {
          activeIndex: 3,
          items: newItemsAfterBackspace,
        },
        type: useTagGroup.stateChangeTypes.TagGroupKeyDownBackspace,
      },
    )

    await user.keyboard('{Delete}')

    const newItemsAfterDelete = [
      ...defaultProps.initialItems.slice(0, 3),
      ...defaultProps.initialItems.slice(5),
    ]

    expect(stateReducer).toHaveBeenCalledTimes(5)
    expect(stateReducer).toHaveBeenNthCalledWith(
      5,
      {
        activeIndex: 3,
        items: newItemsAfterBackspace,
      },
      {
        changes: {
          activeIndex: 3,
          items: newItemsAfterDelete,
        },
        type: useTagGroup.stateChangeTypes.TagGroupKeyDownDelete,
      },
    )

    await clickOnRemoveTag(0)

    const newItemsAfterRemoveClick = [
      ...defaultProps.initialItems.slice(1, 3),
      ...defaultProps.initialItems.slice(5),
    ]

    expect(stateReducer).toHaveBeenCalledTimes(6)
    expect(stateReducer).toHaveBeenNthCalledWith(
      6,
      {
        activeIndex: 3,
        items: newItemsAfterDelete,
      },
      {
        changes: {
          activeIndex: 0,
          items: newItemsAfterRemoveClick,
        },
        index: 0,
        type: useTagGroup.stateChangeTypes.TagRemoveClick,
      },
    )
  })

  test('environment substitutes window when passed', () => {
    const element = {style: {}, setAttribute: jest.fn(), remove: jest.fn()}
    const environment = {
      document: {
        body: {appendChild: jest.fn()},
        createElement: jest.fn().mockReturnValue(element),
      } as unknown as Document,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      Node: {} as unknown as typeof window.Node,
    }
    const {unmount} = renderTagGroup({
      environment,
    })

    expect(environment.document.createElement).toHaveBeenCalledTimes(1)
    expect(environment.document.createElement).toHaveBeenCalledWith('div')
    expect(element.setAttribute).toHaveBeenCalledTimes(1)
    expect(element.setAttribute).toHaveBeenCalledWith(
      'id',
      A11Y_DESCRIPTION_ELEMENT_ID,
    )
    expect(environment.document.body.appendChild).toHaveBeenCalledTimes(1)
    expect(environment.document.body.appendChild).toHaveBeenCalledWith(element)
    expect(element.remove).not.toHaveBeenCalled()

    unmount()

    expect(element.remove).toHaveBeenCalledTimes(1)
  })

  test('removeElementDescription can be overriden', () => {
    const removeElementDescription = 'just remove it'
    const {getByText, queryByText} = renderTagGroup({
      removeElementDescription,
    })

    expect(getByText(removeElementDescription)).toBeInTheDocument()
    expect(queryByText('Press Delete or Backspace to remove tag.')).not.toBeInTheDocument()
  })

  test('removeElementDescription has a default options', () => {
    const {getByText} = renderTagGroup()

    expect(getByText('Press Delete or Backspace to remove tag.')).toBeInTheDocument()
  })

  test('onStateChange is called after adding an item', () => {
    const onStateChange = jest.fn()
    const {result} = renderUseTagGroup({onStateChange})

    act(() => {
      result.current.addItem('test')
    })

    expect(onStateChange).toHaveBeenCalledTimes(1)
    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      items: [...defaultProps.initialItems, 'test'],
      type: useTagGroup.stateChangeTypes.FunctionAddItem,
    })
  })

  test('onStateChange is called after each user action', async () => {
    const onStateChange = jest.fn()
    const {clickOnTag, clickOnRemoveTag, user} = renderTagGroup({onStateChange})

    await clickOnTag(2)

    expect(onStateChange).toHaveBeenCalledTimes(1)
    expect(onStateChange).toHaveBeenCalledWith({
      type: useTagGroup.stateChangeTypes.TagClick,
      activeIndex: 2,
    })

    await clickOnRemoveTag(4)

    expect(onStateChange).toHaveBeenCalledTimes(2)
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      type: useTagGroup.stateChangeTypes.TagRemoveClick,
      activeIndex: 4,
      items: [
        ...defaultProps.initialItems.slice(0, 4),
        ...defaultProps.initialItems.slice(5),
      ],
    })

    await user.keyboard('{ArrowLeft}')

    expect(onStateChange).toHaveBeenCalledTimes(3)
    expect(onStateChange).toHaveBeenNthCalledWith(3, {
      type: useTagGroup.stateChangeTypes.TagGroupKeyDownArrowLeft,
      activeIndex: 3,
    })

    await user.keyboard('{ArrowRight}')

    expect(onStateChange).toHaveBeenCalledTimes(4)
    expect(onStateChange).toHaveBeenNthCalledWith(4, {
      type: useTagGroup.stateChangeTypes.TagGroupKeyDownArrowRight,
      activeIndex: 4,
    })

    await user.keyboard('{Delete}')

    expect(onStateChange).toHaveBeenCalledTimes(5)
    expect(onStateChange).toHaveBeenNthCalledWith(5, {
      type: useTagGroup.stateChangeTypes.TagGroupKeyDownDelete,
      items: [
        ...defaultProps.initialItems.slice(0, 4),
        ...defaultProps.initialItems.slice(6),
      ],
    })

    await user.keyboard('{Backspace}')

    expect(onStateChange).toHaveBeenCalledTimes(6)
    expect(onStateChange).toHaveBeenNthCalledWith(6, {
      type: useTagGroup.stateChangeTypes.TagGroupKeyDownBackspace,
      items: [
        ...defaultProps.initialItems.slice(0, 4),
        ...defaultProps.initialItems.slice(7),
      ],
    })
  })

  test('onActiveIndexChange is called after active index changes', async () => {
    const onActiveIndexChange = jest.fn()
    const {clickOnTag, clickOnRemoveTag} = renderTagGroup({onActiveIndexChange})

    await clickOnTag(2)

    expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
    expect(onActiveIndexChange).toHaveBeenCalledWith({
      type: useTagGroup.stateChangeTypes.TagClick,
      activeIndex: 2,
      items: defaultProps.initialItems,
    })

    onActiveIndexChange.mockClear()
    await clickOnRemoveTag(2)

    expect(onActiveIndexChange).not.toHaveBeenCalled()
  })

  test('onItemsChange is called after items change', async () => {
    const onItemsChange = jest.fn()
    const {clickOnTag, clickOnRemoveTag} = renderTagGroup({onItemsChange})

    await clickOnTag(2)

    expect(onItemsChange).not.toHaveBeenCalled()

    await clickOnRemoveTag(2)

    expect(onItemsChange).toHaveBeenCalledTimes(1)
    expect(onItemsChange).toHaveBeenCalledWith({
      type: useTagGroup.stateChangeTypes.TagRemoveClick,
      activeIndex: 2,
      items: [
        ...defaultProps.initialItems.slice(0, 2),
        ...defaultProps.initialItems.slice(3),
      ],
    })
  })
})
