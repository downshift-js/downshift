import PropTypes from 'prop-types'
import {Environment} from '../../types'
import {noop} from '../../utils'
import {defaultProps as defaultPropsCommon} from '../utils'
import {
  A11yRemovalMessage,
  UseMultipleSelectionState,
  UseMultipleSelectionProps,
} from './types'

/**
 * Returns a message to be added to aria-live region when item is removed.
 *
 * @param selectionParameters Parameters required to build the message.
 * @returns The a11y message.
 */
function getA11yRemovalMessage<I>(
  selectionParameters: A11yRemovalMessage<I>,
): string {
  const {removedSelectedItem, itemToString} = selectionParameters

  return `${itemToString(removedSelectedItem)} has been removed.`
}

const propTypes = {
  selectedItems: PropTypes.array,
  initialSelectedItems: PropTypes.array,
  defaultSelectedItems: PropTypes.array,
  itemToString: PropTypes.func,
  getA11yRemovalMessage: PropTypes.func,
  stateReducer: PropTypes.func,
  activeIndex: PropTypes.number,
  initialActiveIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  onSelectedItemsChange: PropTypes.func,
  keyNavigationNext: PropTypes.string,
  keyNavigationPrevious: PropTypes.string,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any,
    }),
  }),
}

/**
 * Gets the initial state based on the provided props. It uses initial, default
 * and controlled props related to state in order to compute the initial value.
 *
 * @param props Props passed to the hook.
 *
 * @returns The initial state.
 */
export function getInitialState<I>(
  props: UseMultipleSelectionProps<I>,
): UseMultipleSelectionState<I> {
  const activeIndex =
    props.activeIndex ??
    props.initialActiveIndex ??
    props.defaultActiveIndex ??
    -1
  const selectedItems =
    props.selectedItems ??
    props.initialSelectedItems ??
    props.defaultSelectedItems ??
    []

  return {
    activeIndex,
    selectedItems,
  }
}

/**
 * Returns true if dropdown keydown operation is permitted. Should not be
 * allowed on keydown with modifier keys (ctrl, alt, shift, meta), on
 * input element with text content that is either highlighted or selection
 * cursor is not at the starting position.
 *
 * @param event The event from keydown.
 * @returns Whether the operation is allowed.
 */
export function isKeyDownOperationPermitted(event: KeyboardEvent): boolean {
  if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
    return false
  }

  const element = event.target

  if (
    element instanceof HTMLInputElement && // if element is a text input
    element.value !== '' && // and we have text in it
    // and cursor is either not at the start or is currently highlighting text.
    (element.selectionStart !== 0 || element.selectionEnd !== 0)
  ) {
    return false
  }

  return true
}

export const defaultProps = {
  environment: defaultPropsCommon.environment as Environment,
  itemToString: defaultPropsCommon.itemToString,
  getA11yRemovalMessage,
  keyNavigationNext: 'ArrowRight',
  keyNavigationPrevious: 'ArrowLeft',
  stateReducer: defaultPropsCommon.stateReducer,
}

// eslint-disable-next-line import/no-mutable-exports
export let validatePropTypes: (
  options: unknown,
  caller: Function,
) => void = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (options, caller) => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}
