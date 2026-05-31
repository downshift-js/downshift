import {resetIdCounter} from '../generateId'

test('resetIdCounter shows a warning when using React 18+', () => {
  const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

  resetIdCounter()
  expect(consoleWarnMock).toHaveBeenCalledWith(
    `It is not necessary to call resetIdCounter when using React 18+`,
  )
})
