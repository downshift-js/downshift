import {renderTagGroup, renderUseTagGroup, defaultIds, act} from '../testUtils'

describe('getTagProps', () => {
  describe('hook props', () => {
    test('assign assigns a role of "row"', () => {
      const {result} = renderUseTagGroup()
      const tagGroupProps = result.current.getTagProps({index: 0})

      expect(tagGroupProps.role).toEqual('row')
      expect(tagGroupProps.tabIndex).toEqual(-1)
    })

    test('assign default value to id', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.getTagProps({index: 0}).id).toEqual(
        `${defaultIds.getTagId(0)}`,
      )
    })

    test('assign custom value passed by user to id', () => {
      const getTagId = (index: number) => `my-custom-item-id-${index}`
      const {result} = renderUseTagGroup({getTagId})

      expect(result.current.getTagProps({index: 0}).id).toEqual(getTagId(0))
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.getTagProps({foo: 'bar', index: 0})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        const {onClick} = result.current.getTagProps({
          onClick: userOnClick,
          index: 1,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(1)
    })

    test('event handler onClick is called along without downshift handler if event.preventDownshiftDefault is passed', () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        const {onClick} = result.current.getTagProps({
          onClick: userOnClick,
          index: 1,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(2)
    })
  })

  describe('click', () => {
    test('sets the item as active and focusable', async () => {
      const {clickOnTag, getTags} = renderTagGroup({initialActiveIndex: 1})

      await clickOnTag(2)

      const tags = getTags()

      expect(tags[2]).toHaveAttribute('tabindex', '0')
      expect(tags[1]).toHaveAttribute('tabindex', '-1')
    })
  })
})
