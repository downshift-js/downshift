import {cleanup} from '@testing-library/react'
import {cleanupA11yStatus} from '../../../set-a11y-status'
import {setup} from '../testUtils'

jest.mock('../../../set-a11y-status', () => ({
  __esModule: true,
  default: jest.fn(),
  cleanupA11yStatus: jest.fn(),
}))

describe('lifecycle', () => {
  afterEach(cleanup)

  test('cleanup status message on unmount', () => {
    const {unmount} = setup()

    expect(cleanupA11yStatus).toHaveBeenCalledTimes(0)
    unmount()
    expect(cleanupA11yStatus).toHaveBeenCalledTimes(1)
  })
})
