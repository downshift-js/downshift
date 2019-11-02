import {
  ItemClick,
  MenuKeyDownEnter,
  FunctionSelectItem,
} from './stateChangeTypes'

export default function selectCallbacks(action, newState) {
  handleOnItemSelectedCallback(action, newState)
}

function handleOnItemSelectedCallback(action, newState) {
  if (!action.props.onItemSelected) return

  if (wasItemSelected(action)) {
    action.props.onItemSelected(newState)
  }
}

function wasItemSelected(action) {
  switch (action.type) {
    case ItemClick:
    case MenuKeyDownEnter:
    case FunctionSelectItem:
      return true
    default:
      return false
  }
}
