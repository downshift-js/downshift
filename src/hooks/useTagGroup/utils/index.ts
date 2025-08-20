import PropTypes from 'prop-types'

export {useElementIds} from './useElementIds'
export {
  getInitialState,
  type UseElementIdsProps,
  type UseElementIdsReturnValue,
} from './getInitialState'
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
