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
})
