import { act } from 'react-dom/test-utils'
import {
  screen,
  defaultProps,
  renderTagGroup,
  renderUseTagGroup,
} from '../testUtils'

describe('getTagGroupProps', () => {
  describe('hook props', () => {
    test('assign assigns a role of "grid" and aria live attributes', () => {
      const {result} = renderUseTagGroup()
      const tagGroupProps = result.current.getTagGroupProps()

      expect(tagGroupProps.role).toEqual('grid')
      expect(tagGroupProps.id).toEqual('downshift-test-id-tag-group')
      expect(tagGroupProps["aria-live"]).toEqual('polite')
      expect(tagGroupProps["aria-atomic"]).toEqual('false')
      expect(tagGroupProps["aria-relevant"]).toEqual('additions')
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.getTagGroupProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        const {onKeyDown} = result.current.getTagGroupProps({
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(1)
    })

    test('event handler onKeyDown is called along without downshift handler if event.preventDownshiftDefault is passed', () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        const {onKeyDown} = result.current.getTagGroupProps({
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(2)
    })
  })

  describe('keydown', () => {
    test('arrow left moves selection to the previous item', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      await clickOnTag(2)
      await user.keyboard('{ArrowLeft}')

      const tags = getTags()

      expect(tags[2]).toHaveAttribute('tabindex', '-1')
      expect(tags[1]).toHaveAttribute('tabindex', '0')
    })

    test('arrow left moves selection to the last item if first item was active', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      await clickOnTag(0)
      await user.keyboard('{ArrowLeft}')

      const tags = getTags()

      expect(tags[tags.length - 1]).toHaveAttribute('tabindex', '0')
      expect(tags[0]).toHaveAttribute('tabindex', '-1')
    })

    test('arrow right moves selection to the previous item', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      await clickOnTag(2)
      await user.keyboard('{ArrowRight}')

      const tags = getTags()

      expect(tags[2]).toHaveAttribute('tabindex', '-1')
      expect(tags[3]).toHaveAttribute('tabindex', '0')
    })

    test('arrow right moves selection to the first item if last item was active', async () => {
      const lastItemIndex = defaultProps.initialItems.length - 1
      const {clickOnTag, user, getTags} = renderTagGroup()

      await clickOnTag(lastItemIndex)
      await user.keyboard('{ArrowRight}')

      const tags = getTags()

      expect(tags[lastItemIndex]).toHaveAttribute('tabindex', '-1')
      expect(tags[0]).toHaveAttribute('tabindex', '0')
    })

    test('arrows move selection correctly', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      await clickOnTag(0)
      await user.keyboard('{ArrowRight}')
      await user.keyboard('{ArrowRight}')

      const tags = getTags()

      expect(tags[0]).toHaveAttribute('tabindex', '-1')
      expect(tags[1]).toHaveAttribute('tabindex', '-1')
      expect(tags[2]).toHaveAttribute('tabindex', '0')

      await user.keyboard('{ArrowLeft}')

      expect(tags[2]).toHaveAttribute('tabindex', '-1')
      expect(tags[1]).toHaveAttribute('tabindex', '0')

      await user.keyboard('{ArrowRight}')

      expect(tags[1]).toHaveAttribute('tabindex', '-1')
      expect(tags[2]).toHaveAttribute('tabindex', '0')
    })

    test('delete removes the active item', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      const tagsCount = getTags().length

      await clickOnTag(2)
      await user.keyboard('{Delete}')

      const newTagsCount = getTags().length

      expect(newTagsCount).toEqual(tagsCount - 1)
      expect(
        screen.queryByRole('tag', {name: defaultProps.initialItems[2]}),
      ).not.toBeInTheDocument()
    })

    test('backspace removes the active item', async () => {
      const {clickOnTag, user, getTags} = renderTagGroup()

      const tagsCount = getTags().length

      await clickOnTag(2)
      await user.keyboard('{Backspace}')

      const newTagsCount = getTags().length

      expect(newTagsCount).toEqual(tagsCount - 1)
      expect(
        screen.queryByRole('tag', {name: defaultProps.initialItems[2]}),
      ).not.toBeInTheDocument()
    })
  })
})
