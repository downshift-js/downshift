import {cleanup} from '@testing-library/react'
import {renderUseCombobox} from '../testUtils'
import {defaultIds} from '../../testUtils'

describe('getLabelProps', () => {
  afterEach(cleanup)

  test('should have a default id assigned', () => {
    const {result} = renderUseCombobox()
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(defaultIds.labelId)
  })

  test('should have custom id if set by the user', () => {
    const props = {
      labelId: 'my-custom-label-id',
    }
    const {result} = renderUseCombobox(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(props.labelId)
  })

  test('should assign htmlFor with the value of the input id', () => {
    const props = {
      inputId: 'my-custom-input-id',
    }
    const {result} = renderUseCombobox(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.htmlFor).toEqual(props.inputId)
  })

  test('passes props downwards', () => {
    const {result} = renderUseCombobox()
    const props = {foo: 'bar'}
    const labelProps = result.current.getLabelProps(props)

    expect(labelProps).toEqual(expect.objectContaining({foo: 'bar'}))
  })
})
