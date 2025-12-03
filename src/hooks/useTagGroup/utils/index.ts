import PropTypes from 'prop-types'

export {
  type UseElementIdsProps,
  type UseElementIdsReturnValue,
  useElementIds,
} from './useElementIds'
export {getInitialState} from './getInitialState'
export {isStateEqual} from './isStateEqual'
export {
  useAccessibleDescription,
  A11Y_DESCRIPTION_ELEMENT_ID,
} from './useAccessibleDescription'

export const propTypes: Record<
  string,
  PropTypes.Requireable<(...args: unknown[]) => unknown>
> = {
  isItemDisabled: PropTypes.func,
}
