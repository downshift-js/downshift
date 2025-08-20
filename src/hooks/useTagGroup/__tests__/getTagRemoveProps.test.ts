import {
  renderTagGroup,
  renderUseTagGroup,
  defaultIds,
  act,
  defaultProps,
  screen,
} from './utils'

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

describe('getTagRemoveProps', () => {
  describe('hook props', () => {
    test('assign assigns tabindex of -1 and aria-labelledby', () => {
      const {result} = renderUseTagGroup()
      const tagRemoveProps = result.current.getTagRemoveProps({index: 0})
      const tagId = defaultIds.getTagId(0)

      expect(tagRemoveProps.tabIndex).toEqual(-1)
      expect(tagRemoveProps['aria-labelledby']).toEqual(
        `${tagId}-remove ${tagId}`,
      )
    })

    test('assign default value to id', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.getTagRemoveProps({index: 0}).id).toEqual(
        `${defaultIds.getTagId(0)}-remove`,
      )
    })

    test('assign custom value passed by user to id', () => {
      const getTagId = (index: number) => `my-custom-item-id-${index}`
      const {result} = renderUseTagGroup({getTagId})

      expect(result.current.getTagRemoveProps({index: 0}).id).toEqual(
        `${getTagId(0)}-remove`,
      )
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseTagGroup()

      expect(
        result.current.getTagRemoveProps({foo: 'bar', index: 0}),
      ).toHaveProperty('foo', 'bar')
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const stopPropagation = jest.fn()
      const {result} = renderUseTagGroup()

      act(() => {
        const {onClick} = result.current.getTagRemoveProps({
          onClick: userOnClick,
          index: 1,
        })

        onClick({stopPropagation})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.items).not.toContain(defaultProps.initialItems[1])
      expect(stopPropagation).toHaveBeenCalledTimes(1)
    })

    test('event handler onClick is called along without downshift handler if event.preventDownshiftDefault is passed', () => {
      const stopPropagation = jest.fn()
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        const {onClick} = result.current.getTagRemoveProps({
          onClick: userOnClick,
          index: 1,
        })

        onClick({stopPropagation})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.items).toContain(defaultProps.initialItems[1])
      expect(stopPropagation).not.toHaveBeenCalled()
    })
  })

  describe('click', () => {
    test('removes the tag', async () => {
      const {clickOnRemoveTag} = renderTagGroup()

      await clickOnRemoveTag(2)

      expect(
        screen.getByRole('row', {name: defaultProps.initialItems[1]}),
      ).toBeInTheDocument()
    })

    
  })
})
