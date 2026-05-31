import {validateControlledUnchanged} from '../validateControlledUnchanged'

describe('validateControlledUnchanged', () => {
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => jest.mocked(console.error).mockRestore())

  test('does not error when props stay uncontrolled', () => {
    const state = {
      number: '123',
    }
    const prevProps = {
      number: undefined,
    }
    const nextProps = {
      number: undefined,
    }
    validateControlledUnchanged(state, prevProps, nextProps)

    expect(console.error).not.toHaveBeenCalled()
  })

  test('does not error when props stay controlled', () => {
    const state = {
      number: '123',
    }
    const prevProps = {
      number: '456',
    }
    const nextProps = {
      number: '789',
    }
    validateControlledUnchanged(state, prevProps, nextProps)

    expect(console.error).not.toHaveBeenCalled()
  })

  test('shows error when props become controlled from uncontrolled', () => {
    const state = {
      number: '123',
    }
    const prevProps = {
      number: undefined,
    }
    const nextProps = {
      number: '789',
    }
    validateControlledUnchanged(state, prevProps, nextProps)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      'downshift: A component has changed the uncontrolled prop "number" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props',
    )
  })

  test('shows error when props become uncontrolled from controlled', () => {
    const state = {
      number: '123',
    }
    const prevProps = {
      number: '788',
    }
    const nextProps = {
      number: undefined,
    }
    validateControlledUnchanged(state, prevProps, nextProps)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      'downshift: A component has changed the controlled prop "number" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props',
    )
  })
})
