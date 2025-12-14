import PropTypes from 'prop-types'
import {noop} from './noop'

// eslint-disable-next-line import/no-mutable-exports
export let validatePropTypes = noop as (
  options: unknown,
  caller: Function,
  propTypes: Record<
    string,
    PropTypes.Requireable<(...args: unknown[]) => unknown>
  >,
) => void
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (
    options: unknown,
    caller: Function,
    propTypes: Record<
      string,
      PropTypes.Requireable<(...args: unknown[]) => unknown>
    >,
  ): void => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}
