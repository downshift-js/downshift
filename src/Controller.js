import {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'

class Controller extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
  }

  render() {
    return this.props.children(
      this.autocomplete.getControllerStateAndHelpers(),
    )
  }
}

export default Controller
