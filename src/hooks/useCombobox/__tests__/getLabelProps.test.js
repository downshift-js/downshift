import {cleanup} from '@testing-library/react'
import {setupHook, defaultIds} from '../testUtils'

describe('getLabelProps', () => {
  afterEach(cleanup)

  test('should have a default id assigned', () => {
    const {result} = setupHook()
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(defaultIds.labelId)
  })

  test('should have custom id if set by the user', () => {
    const props = {
      labelId: 'my-custom-label-id',
    }
    const {result} = setupHook(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.id).toEqual(props.labelId)
  })

  test('should assign htmlFor with the value of the input id', () => {
    const props = {
      inputId: 'my-custom-input-id',
    }
    const {result} = setupHook(props)
    const labelProps = result.current.getLabelProps()

    expect(labelProps.htmlFor).toEqual(props.inputId)
  })

  test('passes props downwards', () => {
    const {result} = setupHook()
    const props = {foo: 'bar'}
    const labelProps = result.current.getLabelProps(props)

    expect(labelProps).toEqual(expect.objectContaining({foo: 'bar'}))
  })
})
