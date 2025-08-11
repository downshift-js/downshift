import PropTypes from 'prop-types'

export {useElementIds} from './useElementIds'
export {
  getInitialState,
  type UseElementIdsProps,
  type UseElementIdsReturnValue,
} from './getInitialState'
export {isStateEqual} from './isStateEqual'

export const propTypes: Record<
  string,
  PropTypes.Requireable<(...args: unknown[]) => unknown>
> = {
  isItemDisabled: PropTypes.func,
}
