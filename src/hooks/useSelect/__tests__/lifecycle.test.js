import {cleanup} from '@testing-library/react'
import {removeStatusDiv} from '../../../set-a11y-status'
import {setup} from '../testUtils'

jest.mock('../../../set-a11y-status', () => ({
  __esModule: true,
  removeStatusDiv: jest.fn(),
}))

describe('lifecycle', () => {
  afterEach(cleanup)

  test('removes status message container on unmount', () => {
    const {unmount} = setup()
    expect(removeStatusDiv).toHaveBeenCalledTimes(0)
    unmount()
    expect(removeStatusDiv).toHaveBeenCalledTimes(1)
  })
})
