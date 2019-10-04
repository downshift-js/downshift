import {cleanup} from '@testing-library/react'
import {cleanupStatus} from '../../../set-a11y-status'
import {setup} from '../testUtils'

jest.mock('../../../set-a11y-status', () => ({
  __esModule: true,
  default: jest.fn(),
  cleanupStatus: jest.fn(),
}))

describe('lifecycle', () => {
  afterEach(cleanup)

  test('cleanup status message on unmount', () => {
    const {unmount} = setup()

    expect(cleanupStatus).toHaveBeenCalledTimes(0)
    unmount()
    expect(cleanupStatus).toHaveBeenCalledTimes(1)
  })
})
