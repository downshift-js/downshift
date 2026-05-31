import PropTypes from 'prop-types'

import {validatePropTypes} from '../validatePropTypes'

jest.mock('prop-types')

test('validatePropTypes calls PropTypes.checkPropTypes in development', () => {
  process.env.NODE_ENV = 'development'
  const checkPropTypesSpy = jest.spyOn(PropTypes, 'checkPropTypes')
  const options = {test: 'value'}
  const caller = function TestComponent() {} as Function
  const propTypes = {test: PropTypes.string.isRequired}

  validatePropTypes(
    options,
    caller,
    propTypes as unknown as Record<
      string,
      PropTypes.Requireable<(...args: unknown[]) => unknown>
    >,
  )

  expect(checkPropTypesSpy).toHaveBeenCalledTimes(1)
  expect(checkPropTypesSpy).toHaveBeenCalledWith(
    propTypes,
    options,
    'prop',
    caller.name,
  )

  checkPropTypesSpy.mockRestore()
})
