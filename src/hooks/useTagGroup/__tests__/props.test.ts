import {renderTagGroup} from './utils'

describe('props', () => {
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
