import {renderHook} from '@testing-library/react'
import {useControlPropsValidator} from '../useControlPropsValidator'

describe('useControlPropsValidator', () => {
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => jest.mocked(console.error).mockRestore())

  test('validates props have changed from controlled to uncontrolled between renders', () => {
    const initialProps: {
      state: {value: string | undefined}
      props: {value: string | undefined}
    } = {
      state: {value: '123'},
      props: {value: '456'},
    }
    const {rerender} = renderHook(
      hookProps => useControlPropsValidator(hookProps),
      {initialProps},
    )

    expect(console.error).not.toHaveBeenCalled()

    rerender({
      state: {value: '567'},
      props: {value: '477'},
    })

    expect(console.error).not.toHaveBeenCalled()

    rerender({
      state: {value: '567'},
      props: {value: undefined},
    })

    expect(console.error).toHaveBeenCalledTimes(1)
  })

  test('validates props have changed from uncontrolled to controlled between renders', () => {
    const initialProps: {
      state: {value: string | undefined}
      props: {value: string | undefined}
    } = {
      state: {value: '123'},
      props: {value: undefined},
    }
    const {rerender} = renderHook(
      hookProps => useControlPropsValidator(hookProps),
      {initialProps},
    )

    expect(console.error).not.toHaveBeenCalled()

    rerender({
      state: {value: '567'},
      props: {value: undefined},
    })

    expect(console.error).not.toHaveBeenCalled()

    rerender({
      state: {value: '567'},
      props: {value: '766'},
    })

    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
