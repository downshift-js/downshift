import useTagGroup from '..'
import {renderTagGroup, renderHook} from './utils'

describe('props', () => {
  test('passing no props object will still work', () => {
    const result = renderHook(() => useTagGroup())

    expect(result.result.current.getTagGroupProps).toBeDefined()
  })

  test('id if passed will override downshift default', () => {
    const {getTagGroup, getTags} = renderTagGroup({
      id: 'my-custom-little-id',
    })
    const elements = [getTagGroup(), getTags()[0]]

    elements.forEach(element => {
      expect(element).toHaveAttribute(
        'id',
        expect.stringContaining('my-custom-little-id'),
      )
    })
  })
})
