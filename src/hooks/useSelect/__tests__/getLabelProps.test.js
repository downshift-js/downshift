import {act, screen} from '@testing-library/react'
import {renderSelect, renderUseSelect} from '../testUtils'
import {defaultIds, getToggleButton, user} from '../../testUtils'

describe('getLabelProps', () => {
  test('should have a default id assigned', () => {
    const {result} = renderUseSelect()
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(defaultIds.labelId)
  })

  test('should have custom id if set by the user', () => {
    const props = {
      labelId: 'my-custom-label-id',
    }
    const {result} = renderUseSelect(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(props.labelId)
  })

  test('should assign htmlFor with the value of the toggleButton id', () => {
    const props = {
      toggleButtonId: 'my-custom-toggle-button-id',
    }
    const {result} = renderUseSelect(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.htmlFor).toEqual(props.toggleButtonId)
  })

  test('passes props downwards', () => {
    const {result} = renderUseSelect()
    const props = {foo: 'bar'}
    const labelProps = result.current.getLabelProps(props)

    expect(labelProps).toEqual(expect.objectContaining({foo: 'bar'}))
  })

  test('on click moves focus to the toggle button', async () => {
    renderSelect()

    await user.click(
      screen.getByText('Choose an element:', {selector: 'label'}),
    )

    expect(getToggleButton()).toHaveFocus()
  })

  test('event handler onClick is called along with downshift handler', () => {
    const userOnClick = jest.fn()
    const mockToggleButton = {focus: jest.fn()}
    const {result} = renderUseSelect()

    act(() => {
      const {onClick} = result.current.getLabelProps({
        onClick: userOnClick,
      })
      const {ref} = result.current.getToggleButtonProps()
      ref(mockToggleButton)

      onClick({})
    })

    expect(userOnClick).toHaveBeenCalledTimes(1)
    expect(mockToggleButton.focus).toHaveBeenCalledTimes(1)
  })

  test("the downshift handler is not called if 'preventDownshiftDefault' is passed in user event", () => {
    const userOnClick = jest.fn(event => {
      event.preventDownshiftDefault = true
    })
    const mockToggleButton = {focus: jest.fn()}
    const {result} = renderUseSelect()

    act(() => {
      const {onClick} = result.current.getLabelProps({
        onClick: userOnClick,
      })
      const {ref} = result.current.getToggleButtonProps()
      ref(mockToggleButton)

      onClick({})
    })

    expect(userOnClick).toHaveBeenCalledTimes(1)
    expect(mockToggleButton.focus).not.toHaveBeenCalled()
  })
})
