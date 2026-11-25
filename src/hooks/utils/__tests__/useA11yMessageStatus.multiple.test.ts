import {act, renderHook, screen} from '@testing-library/react'
import {useA11yMessageStatus} from '../useA11yMessageStatus'

jest.useFakeTimers()

afterEach(() => {
  act(() => jest.runOnlyPendingTimers())
  document.body.innerHTML = ''
})

afterAll(() => jest.useRealTimers())

test('empty status messages do not cancel pending non-empty status messages', () => {
  const getA11yStatusMessage = ({message}: {message: string}) => message
  const environment = {document}
  const {rerender} = renderHook(
    ({
      firstMessage,
      secondMessage,
      updateCount,
    }: {
      firstMessage: string
      secondMessage: string
      updateCount: number
    }) => {
      useA11yMessageStatus(
        getA11yStatusMessage,
        {message: firstMessage},
        [firstMessage, updateCount],
        environment,
      )
      useA11yMessageStatus(
        getA11yStatusMessage,
        {message: secondMessage},
        [secondMessage, updateCount],
        environment,
      )
    },
    {
      initialProps: {
        firstMessage: '',
        secondMessage: '',
        updateCount: 0,
      },
    },
  )

  rerender({
    firstMessage: 'Item added.',
    secondMessage: '',
    updateCount: 1,
  })
  act(() => jest.advanceTimersByTime(200))

  expect(screen.getByRole('status')).toHaveTextContent('Item added.')
})
